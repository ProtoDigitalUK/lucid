/// <reference types="node" resolution-mode="require"/>
export interface ServiceData {
    url: string;
    redirections?: number;
}
export interface PipeRemoteURLResponse {
    buffer: Buffer;
    contentType: string | undefined;
}
declare const pipeRemoteURL: (data: ServiceData) => Promise<PipeRemoteURLResponse>;
export default pipeRemoteURL;
//# sourceMappingURL=pipe-remote-url.d.ts.map