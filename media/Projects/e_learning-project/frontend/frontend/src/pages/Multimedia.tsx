import { useEffect, useState } from "react";
import api from "../services/api";

export default function Multimedia() {

  const [files, setFiles] = useState([]);

  useEffect(() => {

    api.get("/files/")
      .then((res) => {

        setFiles(res.data);

      });

  }, []);

  return (

    <div className="grid md:grid-cols-3 gap-6 p-6">

      {files.map((file: any) => (

        <div
          key={file.id}
          className="bg-white shadow-lg rounded-xl p-4"
        >

          <h3 className="font-bold mb-2">

            {file.filename}

          </h3>

          {file.file_type === "image" && (

            <img
              src={file.file_url}
              alt=""
              className="rounded-lg w-full"
            />

          )}

          {file.file_type === "video" && (

            <video
              controls
              className="w-full rounded-lg"
            >

              <source src={file.file_url} />

            </video>

          )}

          {file.file_type === "audio" && (

            <audio controls>

              <source src={file.file_url} />

            </audio>

          )}

          {file.file_type === "pdf" && (

            <iframe
              src={file.file_url}
              className="w-full h-80 border"
            />

          )}

          {file.file_type === "animation" && (

            <img
              src={file.file_url}
              alt=""
              className="rounded-lg w-full"
            />

          )}

        </div>

      ))}

    </div>

  );

}