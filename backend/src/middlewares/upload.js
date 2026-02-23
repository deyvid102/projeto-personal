import multer from "multer";

const upload = multer({ dest: "uploads/" }); // pasta temporária
export default upload;
