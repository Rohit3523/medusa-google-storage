import { AbstractFileService } from "@medusajs/medusa"
import {
    DeleteFileType,
    FileServiceGetUploadStreamResult,
    FileServiceUploadResult,
    GetUploadedFileType,
    UploadStreamDescriptorType,
} from "@medusajs/types"
import { Logger } from "@medusajs/medusa";
import { Storage } from '@google-cloud/storage';

interface InjectedDependencies {
    logger: Logger
}

class CloudFileService extends AbstractFileService {
    protected logger_: Logger
    protected storage: Storage
    protected directory: string
    protected bucketName: string

    constructor({ logger }: InjectedDependencies) {
        // @ts-ignore
        super(...arguments)
        this.logger_ = logger;

        logger.info("File service initialized")

        this.bucketName = process.env.GCP_BUCKET_NAME;

        this.directory = process.env?.GCP_DIRECTORY || null;

        this.storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID,
            credentials: {
                client_email: process.env.GCP_CLIENT_EMAIL,
                private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
            }
        })
    }


    async upload(fileData: Express.Multer.File): Promise<FileServiceUploadResult> {
        try {
            const filename = `${Date.now()}_${fileData.originalname}`;
            const destination = this.directory ? `${this.directory}/${filename}` : filename;

            const bucket = this.storage.bucket(this.bucketName);

            const [file] = await bucket.upload(fileData.path, {
                destination,
                resumable: false,
                metadata: {
                    contentType: fileData.mimetype
                },
            });

            await file.makePublic();

            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;

            return {
                key: destination,
                url: publicUrl,
            };
        } catch (error) {
            console.error('Error uploading file to GCP:', error);
            throw new Error('Failed to upload file');
        }
    }

    async uploadProtected(
        fileData: Express.Multer.File
    ): Promise<FileServiceUploadResult> {
        try {
            const filename = `${Date.now()}_${fileData.originalname}`;
            const destination = this.directory ? `${this.directory}/${filename}` : filename;

            const bucket = this.storage.bucket(this.bucketName);

            const [file] = await bucket.upload(fileData.path, {
                destination,
                resumable: false,
                metadata: {
                    contentType: fileData.mimetype
                },
            });

            await file.makePublic();

            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;

            return {
                key: destination,
                url: publicUrl,
            };
        } catch (error) {
            console.error('Error uploading file to GCP:', error);
            throw new Error('Failed to upload file');
        }
    }

    async delete(fileData: DeleteFileType): Promise<void> {
        try {
            const file = this.storage.bucket(this.bucketName).file(fileData.fileKey);
            await file.delete();
            this.logger_.info(`File ${fileData.fileKey} deleted from bucket ${this.bucketName}`);
        } catch (error) {
            this.logger_.error(`Error deleting file ${fileData.fileKey} from GCP: ${error}`);
            throw new Error('Failed to delete file');
        }
    }

    async getUploadStreamDescriptor(
        fileData: UploadStreamDescriptorType
    ): Promise<FileServiceGetUploadStreamResult> {
        const destination = this.directory ? `${this.directory}/${fileData.name}` : fileData.name;
        const writeStream = this.storage.bucket(this.bucketName).file(destination).createWriteStream({
            metadata: {
                contentType: fileData.ext
            },
        });

        return {
            //@ts-ignore
            writeStream,
            stream: writeStream,
            key: destination,
            url: `https://storage.googleapis.com/${this.bucketName}/${destination}`,
        };
    }

    async getDownloadStream(
        fileData: GetUploadedFileType
    ): Promise<NodeJS.ReadableStream> {
        const file = this.storage.bucket(this.bucketName).file(fileData.fileKey);
        const readStream = file.createReadStream();

        return readStream;
    }

    async getPresignedDownloadUrl(
        fileData: GetUploadedFileType
    ): Promise<string> {
        const file = this.storage.bucket(this.bucketName).file(fileData.fileKey);
        const expires = Date.now() + 15 * 60 * 1000; // URL valid for 15 minutes

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: expires,
        });

        return url;
    }
}

export default CloudFileService