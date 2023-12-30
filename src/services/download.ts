export function download(data: string, filename: string, type: string) {
	let file = new Blob([data], { type: type });
	// if (window.navigator.msSaveOrOpenBlob) // IE10+
	//     window.navigator.msSaveOrOpenBlob(file, filename);
	// else
	{ // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

export const downloadFileUrl = (dataUrl: string, fileName: string) => {
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		//window.URL.revokeObjectURL(url);
	}, 0);
}

export const resizeImage = async (file: File, max_size: number) => {
	const p = new Promise<string>((res, rej) => {
		// Load the image
		const reader = new FileReader();
		reader.onload = function (readerEvent) {
			const image = new Image();
			image.onload = function (imageEvent) {

				// Resize the image
				const canvas = document.createElement('canvas');
				let width = image.width;
				let height = image.height;
				if (width > height) {
					if (width > max_size) {
						height *= max_size / width;
						width = max_size;
					}
				} else {
					if (height > max_size) {
						width *= max_size / height;
						height = max_size;
					}
				}
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
				const resizedImage = canvas.toDataURL('image/jpeg');
				res(resizedImage)
			}
			if (readerEvent.target)
				image.src = readerEvent.target.result as string;
		}
		reader.onerror = (x) => rej("Cannot load image");
		reader.readAsDataURL(file);
	});
	return p;
}

export const fileToBase64 = async (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});