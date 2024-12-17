'use client';
import { useState, useCallback, FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { Button } from 'thread-ui';

const ImageUpload = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [customFilename, setCustomFilename] = useState('');

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const processFile = (file: File) => {
		if (!file || !file.type.startsWith('image/')) {
			setUploadStatus('Please select an image file');
			setSelectedFile(null);
			setCustomFilename('');
			return;
		}

		// Extract original filename without extension for the input field
		const extension = file.name.split('.').pop() || '';
		const originalName = file.name.replace(`.${extension}`, '');
		setCustomFilename(originalName);
		setSelectedFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result;
			if (typeof result === 'string') {
				setPreview(result);
			}
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		processFile(file);
	}, []);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedFile) {
			setUploadStatus('Please select a file first');
			return;
		}

		// Create new file with custom filename
		const extension = selectedFile.name.split('.').pop() || '';
		const newFilename = `${customFilename}.${extension}`;

		const formData = new FormData();
		const modifiedFile = new File([selectedFile], newFilename, {
			type: selectedFile.type,
		});
		formData.append('image', modifiedFile);

		try {
			setUploadStatus('Uploading...');
			const response = await fetch('/api/addPhoto', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Upload failed');
			}

			const data = await response.json();
			setPreview(data.url);
			setUploadStatus('Upload successful!');
		} catch (error) {
			if (error instanceof Error) {
				setUploadStatus('Upload failed: ' + error.message);
			} else {
				setUploadStatus('Upload failed: Unknown error');
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 flex flex-col md:flex-row items-center justify-center">
			{!selectedFile ? (
				<div
					className={`border-2 border-dashed rounded-lg p-8 text-center ${
						isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<Upload className="mx-auto h-12 w-12 text-gray-400" />
					<p className="mt-2 text-sm text-gray-600">Drag and drop your image here</p>
					<p className="text-xs text-gray-500 mb-4">Supports: JPG, PNG, GIF</p>

					<div className="flex items-center justify-center">
						<label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
							Select File
							<input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
						</label>
					</div>
				</div>
			) : (
				<div className=" flex flex-col md:flex-row gap-2">
					{preview && (
						<img
							src={preview}
							alt="Preview"
							className="w-full h-full object-cover rounded"
							style={{ height: 'auto', width: 'auto', maxWidth: '256px', maxHeight: '500px' }}
						/>
					)}

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Filename:</label>
						<input
							type="text"
							value={customFilename}
							onChange={(e) => setCustomFilename(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter filename (without extension)"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">Extension: .{selectedFile.name.split('.').pop()}</p>
					</div>

					<Button type="submit" fullWidth>
						Upload Image
					</Button>
				</div>
			)}

			{uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
		</form>
	);
};

export default ImageUpload;
