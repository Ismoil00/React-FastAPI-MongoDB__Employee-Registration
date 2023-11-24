import React, { useState, useEffect } from "react";
import api from "../helpers/api";

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const imageId = "6560a4898282d3b85c2fb3a3";

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(`/get-image/${imageId}`);

        if (!response.ok) {
          throw new Error(`Error fetching image: ${response.statusText}`);
        }

        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();
  }, [imageId]);

  return <div>{imageSrc && <img src={imageSrc} alt="this is test img" />}</div>;
};

export default ImageDisplay;
