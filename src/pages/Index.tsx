import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { toPng } from "html-to-image";
import {
  ImageIcon,
  Palette,
  FlipHorizontal,
  Type,
  Trash2,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CANVAS_SIZE = 500;
const BACKGROUND_COLORS = [
  "#8d927b",
  "#a0b0c0",
  "#c0a0b0",
  "#b0c0a0",
  "#a0c0b0",
  "#b0a0c0",
  "#c0b0a0",
];

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        backgroundColor: BACKGROUND_COLORS[0],
      });
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  const changeBackground = () => {
    if (!fabricRef.current) return;
    const currentColor = fabricRef.current.backgroundColor as string;
    const currentIndex = BACKGROUND_COLORS.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % BACKGROUND_COLORS.length;
    fabricRef.current.backgroundColor = BACKGROUND_COLORS[nextIndex];
    fabricRef.current.renderAll();
  };

  const addImage = () => {
    if (!fabricRef.current) return;
    fabric.Image.fromURL(
      "https://images.unsplash.com/photo-1501286353178-1ec871214838",
      {
        crossOrigin: 'anonymous'
      },
      (img) => {
        if (img) {
          img.scaleToHeight(200);
          img.scaleToWidth(200);
          fabricRef.current?.add(img);
          fabricRef.current?.centerObject(img);
          fabricRef.current?.renderAll();
        }
      }
    );
  };

  const flipSelected = () => {
    if (!fabricRef.current) return;
    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject) {
      toast({
        title: "No object selected",
        description: "Please select an object to flip",
      });
      return;
    }
    activeObject.flipX = !activeObject.flipX;
    fabricRef.current.renderAll();
  };

  const addText = () => {
    if (!fabricRef.current) return;
    const text = new fabric.IText("Your Text Here", {
      left: CANVAS_SIZE / 2,
      top: CANVAS_SIZE / 2,
      fontSize: 30,
      fill: "white",
      textAlign: "center",
      originX: "center",
      originY: "center",
      fontFamily: "Impact",
      stroke: "#000000",
      strokeWidth: 2,
    });
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.renderAll();
  };

  const deleteSelected = () => {
    if (!fabricRef.current) return;
    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject) {
      toast({
        title: "No object selected",
        description: "Please select an object to delete",
      });
      return;
    }
    fabricRef.current.remove(activeObject);
    fabricRef.current.renderAll();
  };

  const downloadCanvas = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current);
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({
        title: "Error downloading image",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <canvas ref={canvasRef} className="rounded-lg shadow-md" />
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={changeBackground}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Change background color"
          >
            <Palette className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={addImage}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Add image"
          >
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={flipSelected}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Flip selected object"
          >
            <FlipHorizontal className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={addText}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Add text"
          >
            <Type className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={deleteSelected}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Delete selected object"
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={downloadCanvas}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            title="Download canvas"
          >
            <Download className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;