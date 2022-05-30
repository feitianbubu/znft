/**
 * form upload 的参数builder
 */
export class uploadFormDataBuilder {
    private readonly formData :FormData;
    private file: File | undefined;
    private fileName : string | undefined;

    /**
     * 构造函数
     */
    constructor() {
      this.formData = new FormData();
    }

    /**
     * 设置文件
     * @param file 文件
     */
    public setFile(file:File) {
      this.file = file;
      return this;
    }

    /**
     * 设置文件名
     * @param fileName 文件名
     */
    public setFileName(fileName:string) {
      this.fileName = fileName;
      return this;
    }

    /**
     * 最终的build
     */
    public build():FormData {
      if (this.file&&this.fileName) {
        this.formData.append('file', this.file, this.fileName );
        return this.formData;
      }
      return this.formData;
    }

  // formData.append('file', file, file.name );
}
