import React, { useEffect, useRef, useState } from 'react';

const FloorPlanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const [roomType, setRoomType] = useState('Kitchen');

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas && window.fabric) {
      const canvas = new window.fabric.Canvas(canvasRef.current, {
        backgroundColor: '#f8fafc',
        selection: true,
      });
      
      // Responsive Resize
      const resizeCanvas = () => {
        const container = document.getElementById('canvas-wrapper');
        if (container) {
          canvas.setWidth(container.clientWidth);
          canvas.setHeight(container.clientWidth * 0.75);
          canvas.renderAll();
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      setFabricCanvas(canvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.dispose();
      };
    }
  }, [canvasRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvas) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result as string;
        window.fabric.Image.fromURL(data, (img: any) => {
            // Scale image to fit canvas while maintaining aspect ratio
            const canvasWidth = fabricCanvas.width;
            const canvasHeight = fabricCanvas.height;
            const scale = Math.min(
                canvasWidth / img.width, 
                canvasHeight / img.height
            );
            
            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'left',
                originY: 'top',
                left: (canvasWidth - img.width * scale) / 2,
                top: (canvasHeight - img.height * scale) / 2
            });

            fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addRoom = () => {
    if (!fabricCanvas) return;

    const colors: Record<string, string> = {
      'Kitchen': 'rgba(255, 138, 101, 0.6)',
      'Master Bedroom': 'rgba(244, 143, 177, 0.6)',
      'Pooja Room': 'rgba(129, 199, 132, 0.6)',
      'Living Room': 'rgba(255, 245, 157, 0.6)',
      'Toilet': 'rgba(239, 154, 154, 0.6)',
      'Study': 'rgba(206, 147, 216, 0.6)'
    };

    const rect = new window.fabric.Rect({
      width: 150,
      height: 100,
      fill: colors[roomType] || 'rgba(200, 200, 200, 0.5)',
      stroke: '#333',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const text = new window.fabric.Text(roomType, {
      fontSize: 16,
      originX: 'center',
      originY: 'center',
      fill: '#1e293b',
      fontWeight: 'bold'
    });

    const group = new window.fabric.Group([rect, text], {
      left: fabricCanvas.width / 2,
      top: fabricCanvas.height / 2,
    });

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
  };

  const clearCanvas = () => {
    if(fabricCanvas) {
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = '#f8fafc';
        fabricCanvas.renderAll();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
        <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">1. Upload Plan</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto items-end">
            <div className="flex-1">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">2. Select Room</label>
                <select 
                    value={roomType} 
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                    <option>Kitchen</option>
                    <option>Master Bedroom</option>
                    <option>Pooja Room</option>
                    <option>Living Room</option>
                    <option>Guest Room</option>
                    <option>Toilet</option>
                    <option>Study</option>
                </select>
            </div>
            <button onClick={addRoom} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition-colors">
                Add Room
            </button>
            <button onClick={clearCanvas} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-colors">
                Clear
            </button>
        </div>
      </div>

      <div id="canvas-wrapper" className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden shadow-inner bg-slate-50 relative">
        <canvas ref={canvasRef} />
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-2 rounded text-xs pointer-events-none">
            Drag to move • Corners to resize • Backspace to delete
        </div>
      </div>
    </div>
  );
};

export default FloorPlanner;