import { useEffect, useRef, useState } from "react";
import { download, downloadFileUrl } from "../services/download";
import { shuffle } from "../services/shuffle";

const testData = "data:image/png;base64,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";

interface IPoint {
	x: number;
	y: number;
}

interface IAction {
	type: "line" | "rect" | "image";
	color: string;
	bits?: any; // ImageElement will reset width, height.
	lines?: IPoint[];
	lineWidth?: number;
}

interface IJSImageState {
	zoom: number;
	rotation: number;
	x: number;
	y: number;
	// transform matrix?

	showGrid: boolean;
	gridSize: number;

	width: number;
	height: number;

	imageBits?: any; // 32bit
	disposeImage?: () => void;

	background?: any; // picture, color?

	selection?: IPoint[];
	
	actions?: IAction[];
	commitedActions?: IAction[];

	drawMx?: any;

	drawCanvas?: HTMLCanvasElement;
	operationCanvas?: HTMLCanvasElement;

	foreColor: string;
	tool: "hand" | "select" | "line" | "rect" | "blur";
	lineWidth: number;
	blurRatio: number;
}

const transformPoint = (matrix: any, point: { x: number, y: number }): { x: number, y: number } => {
	return {
		x: matrix.a * point.x + matrix.c * point.y + matrix.e,
		y: matrix.b * point.x + matrix.d * point.y + matrix.f,
	}
}

const plotLine = (ctx: any, x0: number, y0: number, x1: number, y1: number, skipFirstPixel?:boolean) => {
	let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	let err = dx + dy, e2; /* error value e_xy */
 
	for (; ;) {  /* loop */
		//setPixel (x0,y0);
		if(!skipFirstPixel)
			ctx.fillRect(x0, y0, 1, 1);
		skipFirstPixel = false;
		if (x0 === x1 && y0 === y1) break;
		e2 = 2 * err;
		if (e2 >= dy) { err += dy; x0 += sx; } /* e_xy+e_x > 0 */
		if (e2 <= dx) { err += dx; y0 += sy; } /* e_xy+e_y < 0 */
	}
}

// 1. rendering context -> (just the visible rect)
// 2. draw context -> the checkerboard + image + drawing

// on_paint:
// renderCtx.paint(drawCtx)
// renderCtx.paint(operationCtx)
// renderCtx.paint(grid)

// on_draw:
// update operationCtx
// requestAnimationFrame

// on_draw_complete
// commit operationCtx (paint to drawCtx), clear operationCtx

const getDrawContext = (state: IJSImageState) => {
	let drawCanvas = state.drawCanvas;
	if (!drawCanvas || drawCanvas.width !== state.width || drawCanvas.height !== state.height) {
		if (!drawCanvas)
			drawCanvas = state.drawCanvas = document.createElement("canvas");
		drawCanvas.width = state.width;
		drawCanvas.height = state.height;
		const ctx = drawCanvas.getContext("2d");
		if (!ctx) return;
		// paint background
		const check_size = 5;
		for (let y = 0; y < state.height; y += check_size) {
			for (let x = 0; x < state.width; x += check_size) {
				let p = 0;
				if ((y / check_size) % 2)
					p++;
				if ((x / check_size) % 2)
					p++;
				ctx.fillStyle = (p === 1) ? "#fff" : "#ccc";
				ctx.fillRect(x, y, check_size, check_size);
			}
		}

		// paint image
		if (state.imageBits) {
			ctx.drawImage(state.imageBits, 0, 0);
		}
	}
	return state.drawCanvas;
}

const getOperationContext = (state: IJSImageState) => {
	let canvas = state.operationCanvas;
	if (!canvas || canvas.width !== state.width || canvas.height !== state.height) {
		if (!canvas)
			canvas = state.operationCanvas = document.createElement("canvas");
		canvas.width = state.width;
		canvas.height = state.height;
	}
	return state.operationCanvas;
}

const commitOperationContext = (state: IJSImageState) => {
	if (state.operationCanvas) {
		const draw = getDrawContext(state);
		if (draw) {
			const ctx = draw.getContext("2d");
			ctx?.drawImage(state.operationCanvas, 0, 0);
		}
		if (state.actions) {
			state.commitedActions = (state.commitedActions || []).concat(state.actions);
		}
		state.actions = undefined;
		state.operationCanvas = undefined;
	}
}

const drawActions = (state: IJSImageState) => {
	const canvas = getOperationContext(state);
	if (canvas) {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawActionsInternal(state.actions, ctx);
		ctx.restore();
	}
}

const drawActionsInternal = (actions: IAction[]|undefined, ctx: CanvasRenderingContext2D) => {
	if (actions) {
		let i = 0;
		let e = actions.length - 1;
		for (; i <= e; i++) {
			const act = actions[i];
			const lw = act.lineWidth || 1;
			const l = act.lines;

			switch (act.type) {
				case "line":
					if (!l || !l.length)
						continue;
					if (l.length === 1) {
						ctx.fillStyle = act.color;
						if (lw === 1) {
							ctx.fillRect(l[0].x, l[0].y, lw, lw);
							console.log("fillrect")
						} else {
							const h = lw / 2 | 0;
							ctx.fillRect(l[0].x-h, l[0].y-h, lw, lw);
						}
					} else {
						ctx.save();
						ctx.beginPath();
						ctx.strokeStyle = act.color;
						ctx.lineWidth = lw;
						ctx.lineCap = "square";//lw === 1 ? "square" : "round";
						ctx.moveTo(l[0].x+0.5, l[0].y+0.5);
						for (let i = 1; i < l.length; i++) {
							ctx.lineTo(l[i].x+0.5, l[i].y+0.5);
						}
						//ctx.closePath();
						ctx.stroke();
						ctx.restore();
					}
					break;
				case "rect":
					if (!l || l.length < 2)
						continue;
					ctx.strokeStyle = act.color;
					ctx.lineCap = "square";
					ctx.strokeRect(l[0].x +0.5, l[0].y+0.5, l[1].x - l[0].x, l[1].y - l[0].y);
					break;
				case "image":
					if (!l || !l.length || !act.bits)
						continue;
					ctx.drawImage(act.bits, l[0].x, l[0].y, l[1].x - l[0].x, l[1].y - l[0].y);
					//ctx.drawImage(act.bits, l[0].x, l[0].y);
					break;
			}
		}
	}
}

const undoLastCommitedOperation = (state: IJSImageState) => {
	if (state.commitedActions) {
		state.drawCanvas = undefined;
		const drawCanvas = getDrawContext(state);

		state.commitedActions.pop();
		state.actions = state.commitedActions;
		state.commitedActions = undefined;

		drawActions(state);
		commitOperationContext(state);
	}
}

const imageOperation = (dst: CanvasRenderingContext2D, src: CanvasRenderingContext2D,
	x0: number, y0: number, w: number, h: number, box: number, operation: "pixelate"|"randomize") => {
	
	const srcBits = src.getImageData(x0, y0, w, h).data;
	const srcStride = w * 4;
	const dstData = dst.createImageData(w, h);//dst.getImageData(0, 0, w, h);
	const dstBits = dstData.data;
	const dstStride = w * 4;

	const getPix = (x: number, y: number, i: number) => {
		
		let color = srcBits[y * srcStride + x * 4 + i] || 0;
		console.log("get[" + x + ":" + y + "]=" + color);
		return color;
	}
	const setPix = (x: number, y: number, i: number, color: number) => {
		dstBits[y * dstStride + x * 4 + i] = color;
		console.log("set[" + x + ":" + y + "]=" + color);
	}
	
	if (operation === "pixelate") {
		for (let y = 0; y < h; y += box) {
			for (let x = 0; x < w; x += box) {
				//rgba
				for (let i = 0; i < 3; i++) {

					let sx = Math.min(x, w - box - 1);
					let sy = Math.min(y, h - box - 1);

					// fixme: replace by matrix
					let acc = 0;
					for (let u = 0; u < box * box; u++) {
						acc += getPix(sx + u % box, sy + ((u / box) | 0), i);
					}
					setPix(x, y, i, acc / (box * box));
				}
				dstBits[y * dstStride + x * 4 + 3] = 0xff;
			}
		}
		const clm = (f: number) => ((f / box) | 0) * box;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				for (let i = 0; i < 4; i++) {
					let s = dstBits[clm(y) * dstStride + clm(x) * 4 + i]
					dstBits[y * dstStride + x * 4 + i] = s;
				}
			}
		}
	} else if (operation === "randomize") {
		for (let y = 0; y < h; y += box) {
			for (let x = 0; x < w; x += box) {

				let shuf = shuffle(Array(box * box).fill(0).map((_, i) => i));
				let sx = Math.min(x, w - box);
				let sy = Math.min(y, h - box);

				for (let v = 0; v < box * box; v++) {
					let u = shuf[v];
					for (let i = 0; i < 4; i++) {
						let pix = getPix(sx + u % box, sy + ((u / box) | 0), i);
						setPix(x + v % box, y + ((v / box) | 0), i, pix);
					}
				}
			}
		}
	} else if (operation === "smudge") {
		// for (let y = 0; y < h; y += box) {
		// 	for (let x = 0; x < w; x += box) {

		// 		let shuf = shuffle(Array(box * box).fill(0).map((_, i) => i));
		// 		let sx = Math.min(x, w - box);
		// 		let sy = Math.min(y, h - box);

		// 		for (let v = 0; v < box * box; v++) {
		// 			let u = shuf[v];
		// 			for (let i = 0; i < 4; i++) {
		// 				let pix = getPix(sx + u % box, sy + ((u / box) | 0), i);
		// 				setPix(x + v % box, y + ((v / box) | 0), i, pix);
		// 			}
		// 		}
		// 	}
		// }
	}
	dst.putImageData(dstData, 0, 0);
}

const blurSelection = (state: IJSImageState) => {
	const sel = state.selection;
	if (!sel) return;

	let x0 = Math.min(sel[0].x, sel[1].x);
	let x1 = Math.max(sel[0].x, sel[1].x);
	let y0 = Math.min(sel[0].y, sel[1].y);
	let y1 = Math.max(sel[0].y, sel[1].y);

	const canvas = document.createElement('canvas');
	
	x1 += 1;
	y1 += 1;

	canvas.width = x1 - x0;
	canvas.height = y1 - y0;
	const image = getDrawContext(state)!;
	const ctx = canvas.getContext("2d")!;

	const scaleWidth = canvas.width / state.blurRatio;
	const scaleHeight = canvas.height / state.blurRatio;
	ctx.imageSmoothingEnabled = true;
	ctx.drawImage(image, x0, y0, canvas.width, canvas.height, 0, 0, scaleWidth, scaleHeight);
	ctx.imageSmoothingEnabled = true;
	ctx.drawImage(canvas, 0, 0, scaleWidth, scaleHeight, 0, 0, canvas.width, canvas.height);
	//imageOperation(ctx, image.getContext("2d")!, x0, y0, x1 - x0, y1 - y0, state.blurRatio, "randomize");

	state.actions = (state.actions || []).concat({ "type": "image", "lines": [{ x: x0, y: y0 }, { x: x1, y: y1 }], "color": "", bits: canvas });
	drawActions(state);
	commitOperationContext(state);
}

const saveImage = (state: IJSImageState) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d')!;
	canvas.width = state.width;
	canvas.height = state.height;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (state.imageBits) {
		ctx.drawImage(state.imageBits, 0, 0);
	}
	drawActionsInternal(state.commitedActions, ctx);
	return canvas;
}

const ImageCanvas = (props: {state: IJSImageState}) => {

	const state = props.state;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);

	const updatePosition = () => {
		const element = scrollerRef.current!; //e.target as HTMLElement;
		let left = element.scrollLeft;
		let top = element.scrollTop;
		
		state.x = left;
		state.y = top;
	}

	const doPaint = () => {
		const c = canvasRef.current;
		if (!c) return;

		let ctx = c.getContext("2d");
		if (!ctx) return;

		updatePosition()

		if (state.zoom > 1) {
			ctx.imageSmoothingEnabled = false;
		}
		else {
			(c as any)['enableRetinaScaling'] = true;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
		}
		// a c e
		// b d f
		// 0 0 1
		ctx.resetTransform();
		ctx.clearRect(0, 0, c.width, c.height);

		// calculate how much we need to move the image to start at 0,0 again (since we rotate over the 0,0 point)
		// we must do this before calling __translate__ as that will break the calculation
		let rotation_offset = { x: 0, y: 0 };
		if (state.rotation) {
			ctx.scale(state.zoom, state.zoom);
			ctx.rotate(state.rotation * Math.PI / 180);
			const mx = ctx.getTransform();
			rotation_offset = transformPoint(mx, { x: state.width, y: state.height });
			if (rotation_offset.x > 0)
				rotation_offset.x = 0;
			if (rotation_offset.y > 0)
				rotation_offset.y = 0;
			rotation_offset = transformPoint(mx.inverse(), rotation_offset);
			ctx.resetTransform();
		}

		ctx.translate(-state.x, -state.y);
		ctx.scale(state.zoom, state.zoom);
		if (state.rotation) {
			const angle = state.rotation * Math.PI / 180;
			ctx.rotate(angle);
			ctx.translate(-rotation_offset.x, -rotation_offset.y);
		}

		const mx = ctx.getTransform();
		state.drawMx = mx.inverse();

		const draw = getDrawContext(state);
		if (draw)
			ctx.drawImage(draw, 0, 0);
		
		if (state.operationCanvas)
			ctx.drawImage(state.operationCanvas, 0, 0);

		// paint grid
		let showGrid = state.showGrid;
		let gridSize = state.gridSize;
		if (state.zoom > 3) {
			showGrid = true;
			gridSize = 1;
		}

		const lineWidth = state.zoom > 1 ? (0.5 / state.zoom) : 0.5;
		if (showGrid) {
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = "#00000080";
			ctx.beginPath();
			for (let y = gridSize; y < state.height; y += gridSize) {
				ctx.moveTo(0, y);
				ctx.lineTo(state.width, y);
			}
			for (let x = gridSize; x < state.width; x += gridSize) {
				ctx.moveTo(x, 0);
				ctx.lineTo(x, state.height);
			}
			ctx.stroke();
			ctx.closePath();
		}
		// paint selection
		if (state.selection && state.selection.length > 1) {
			const sel = state.selection;
			ctx.save();
			const xWidth = lineWidth * 2;
			ctx.lineWidth = xWidth;
			ctx.strokeStyle = "black";
			ctx.setLineDash([xWidth*5, xWidth*5])
			// increase size so that the selection is around the outer border
			let x0 = Math.min(sel[0].x, sel[1].x);
			let x1 = Math.max(sel[0].x, sel[1].x);
			let y0 = Math.min(sel[0].y, sel[1].y);
			let y1 = Math.max(sel[0].y, sel[1].y);
			ctx.strokeRect(x0 + xWidth / 2, y0 + xWidth / 2, x1 - x0 + 1, y1 - y0 + 1);
			ctx.strokeStyle = "white";
			ctx.setLineDash([0, xWidth*5, xWidth*5, 0])
			ctx.strokeRect(x0 + xWidth/2, y0 + xWidth/2, x1 - x0 + 1, y1 - y0 + 1);
			ctx.restore();
		}		
	}

	useEffect(() => {
		doPaint();
	}, [state]);

	const getEventPoint = (e: React.MouseEvent) => {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX - r.x;
		const y = e.clientY - r.y;
			
		let pt = transformPoint(state.drawMx, { x: x, y: y });
		pt = { x: Math.trunc(pt.x), y: Math.trunc(pt.y) };
		return pt;
	}

	const isDown = useRef<{ x: number, y: number } | undefined>(undefined);
	const onMouseDown = (e:React.MouseEvent) => {
	
		if (!state.drawMx) return;
		const pt = getEventPoint(e);

		isDown.current = pt;

		if (state.tool === "line" || state.tool === "rect") {
			state.actions = state.actions || [];
			state.actions.push({
				type: state.tool, lines: [pt], color: state.foreColor, lineWidth: state.lineWidth
				//type: "putpixel", w: 0, h: 0, x: pt.x, y: pt.y, color: state.foreColor || "#000000"
			});
			drawActions(state);
			//console.log("mouseDown:" + pt.x + "/" + pt.y);
		} else if (state.tool === "select") {
			state.selection = [pt];
		}
		doPaint();
	}

	const animRef = useRef<number>(0);

	const onMouseMove = (e: React.MouseEvent) => {
		if (isDown.current) {
			
			if (!state.drawMx) return;
			const pt = getEventPoint(e);
			if (isDown.current.x === pt.x && isDown.current.y === pt.y)
				return;

			isDown.current = pt;

			if (state.tool === "hand")
				return;

			if (state.tool === "select") {
				state.selection![1] = pt;
			} else if(state.actions) {
				const act = state.actions[state.actions.length - 1]
				if (state.tool === "line") {
					act.lines!.push(pt);
				} else if (state.tool === "rect") {
					act.lines![1] = pt;
				}
			}

			if (animRef.current)
				return;
			animRef.current = window.requestAnimationFrame(() => {
				drawActions(state);
				doPaint();
				animRef.current = 0;
			});
		}
	}
	const onMouseUp = (e: React.MouseEvent) => {
		commitOperationContext(state);
		isDown.current = undefined;
	}

	const onScroll = (e: React.UIEvent) => {
		doPaint();
	}

	let scrollWidth = Math.ceil(state.width * state.zoom);
	let scrollHeight = Math.ceil(state.height * state.zoom);
	if (state.rotation === 90 || state.rotation == 270) {
		//onst z = scrollWidth;
		scrollWidth = Math.ceil(state.height * state.zoom);
		scrollHeight = Math.ceil(state.width * state.zoom);
	}

	if (canvasRef.current) {
		const c = canvasRef.current;
		const p = c.parentElement!;
		if (c.width !== p.offsetWidth || c.height !== p.offsetHeight) {
			c.width = p.offsetWidth;
			c.height = p.offsetHeight;
			console.log("update canvas size");
			c.style.width = p.offsetWidth + "px";
			c.style.height = p.offsetHeight + "px";
		}
	}

	return <div className="jsPaintOuter" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
		<canvas className="jsInnerCanvas" ref={canvasRef} />
		<div ref={scrollerRef} className="jsPaintCanvas" onScroll={onScroll}>
			<div style={{ width: scrollWidth, height: scrollHeight }} className="jsScroller" />
		</div>
	</div>
}

export const ImagePage = (props: {}) => {

	const [state, setState] = useState<IJSImageState>({
		x: 0,
		y: 0,
		rotation: 0,
		zoom: 1,
		width: 640,
		height: 480,
		imageBits: undefined,
		background: "black",
		showGrid: true,
		gridSize: 10,
		foreColor: "#000",
		lineWidth: 1,
		tool: "line",
		blurRatio: 5,
	})

	const loadImage = (src: string, disposeImage?: ()=>void, extra?: any) => {
		const imgElement = document.createElement("img");
		imgElement.onload = () => {
			let newState: IJSImageState = {
				imageBits: imgElement,
				x: 0,
				y: 0,
				rotation: 0,
				zoom: 1,
				width: imgElement.naturalWidth,
				height: imgElement.naturalHeight,
				showGrid: false,
				gridSize: 10,
				disposeImage: disposeImage,
				foreColor: "#000",
				lineWidth: 1,
				tool: "select",
				blurRatio: 5,
			};
			if (extra)
				newState = { ...newState, ...extra };
			setState(oldState => {
				if (oldState && oldState.disposeImage)
					oldState.disposeImage();
				return newState;
			});
		};
		imgElement.src = src;
	} 

	useEffect(() => {
		loadImage(testData, undefined, {zoom:10, height:50, rotation:0});
	}, []);

	const setZoom = (add: boolean) => {
		if (add) {
			if (state.zoom >= 2)
				state.zoom++
			else
				state.zoom += 0.10; 
		} else {
			if (state.zoom >= 3)
				state.zoom--
			else
				state.zoom -= 0.10; 
		}
		setState({ ...state });
	}

	const setRotate = (left: boolean) => {
		const r = state.rotation + (left ? -90 : 90);
		setState({ ...state, rotation: (r + 360) % 360 });
	}

	const open = () => {
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = ".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*";
		input.onchange = (e: any) => {
			var file = e.target?.files[0] as File;
			if (file) {
				const url = window.URL.createObjectURL(file);
				loadImage(url, () => window.URL.revokeObjectURL(url), { fileName: file.name, fileType: file.type });
			}
		}
		input.style.opacity = "0";
		input.click();
	}
	const save = () => {
		const x = state as any;
		const canvas = saveImage(state);
		const url = canvas.toDataURL(x.fileType || "image/png");
		downloadFileUrl(url, x.fileName || "image.png");
		// const data = canvas.toBlob((b) => {
		// 	download(b, x.fileName, x.fileType)
		// }, x.fileType);
	}

	const onForeColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, foreColor: e.target.value });
	}

	const setTool = (tool: string) => {
		if (tool === "undo") {
			undoLastCommitedOperation(state);
			setState({ ...state });
			return;
		}
		if (tool === "blur") {
			blurSelection(state);
			// do not change state
			setState({ ...state, tool: "select" });
			return;
		}

		//fixme: commit tool, if we have an active overlay image, commit.
		if (tool === "line" || tool === "rect")
			state.selection = undefined;
		setState({ ...state, tool: tool as any });
	}
	const setLineWidth = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setState({ ...state, lineWidth: +e.target.value });
	}
	const setBlurRatio = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setState({ ...state, blurRatio: +e.target.value });
	}

	const tools = ["undo", "hand", "select", "line", "rect", "blur"];
	const lineWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return <div className="jsPaintPage">
		<div className="jsPaintToolbar">
			<span className="jsPaintTitle">Screenshooter</span>
			<button onClick={open}>Open</button>
			<button onClick={save}>Save</button>
			<span>Zoom:</span>
			<button onClick={e => setZoom(true)}>+</button>
			<span>{state.zoom.toFixed(2)||"0"}</span>
			<button onClick={e => setZoom(false)}>-</button>
			<span>Rotate:</span>
			<button onClick={e => setRotate(true)}>Left</button>
			<span>{state.rotation||"0"}</span>
			<button onClick={e => setRotate(false)}>Right</button>
			<span>Line:</span>
			<input type="color" onChange={onForeColorChanged} />
			<select value={state.lineWidth} style={{width: "fit-content"}} onChange={setLineWidth}>{lineWidths.map(x => <option key={"k" + x} value={x}>{x + "px"}</option>)}</select>
			<span>Blur:</span>
			<select value={state.blurRatio} style={{ width: "fit-content" }} onChange={setBlurRatio}>{[2,3,4,5,6,7,8,9,10,12,15,20,40,80].map(x => <option key={"k" + x} value={x}>{x + "x"}</option>)}</select>
			<br />
			{tools.map(x => {
				const currentTool = state.tool || "line";
				return <button key={x} style={{fontWeight:x===currentTool?"600":"unset"}} onClick={e => setTool(x)}>{x}</button>
			})}
		</div>
		<ImageCanvas state={state} />
	</div>
}