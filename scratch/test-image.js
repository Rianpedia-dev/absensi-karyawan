const { Document, Packer, Paragraph, ImageRun } = require("docx");
const fs = require("fs");
const path = require("path");

try {
    const imagePath = path.join(__dirname, "..", "image-halaman-bahan-skripsi", "dashhboard(admin).png");
    console.log("Reading image from:", imagePath);
    if (!fs.existsSync(imagePath)) {
        console.error("Image file does not exist!");
        process.exit(1);
    }
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: fs.readFileSync(imagePath),
                                transformation: {
                                    width: 450,
                                    height: 250
                                }
                            })
                        ]
                    })
                ]
            }
        ]
    });

    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(path.join(__dirname, "test.docx"), buffer);
        console.log("Success: Image compiled to test.docx");
    }).catch(err => {
        console.error("Error packer:", err);
    });
} catch (error) {
    console.error("Catched error:", error);
}
