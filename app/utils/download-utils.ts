import { File, knownFolders, path } from '@nativescript/core';
import * as JSZip from 'jszip';

export async function createDownloadableZip(filePath: string): Promise<ArrayBuffer> {
    const zip = new JSZip();
    const fileName = path.basename(filePath);
    const fileContent = await File.fromPath(filePath).read();
    
    zip.file(fileName, fileContent);
    
    return await zip.generateAsync({
        type: 'arraybuffer',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    });
}

export function saveFile(content: ArrayBuffer, fileName: string): void {
    const downloadsFolder = knownFolders.downloads();
    const filePath = path.join(downloadsFolder.path, fileName);
    const file = File.fromPath(filePath);
    
    file.writeSync(content);
    console.log(`文件已保存到: ${filePath}`);
}