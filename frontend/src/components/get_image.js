// Example code to fetch and display the image in React

import React, { useState, useEffect } from "react";

const ImageDisplay = ({ imageId }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `http://your-api-url/get-image/${imageId}`
        );
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

  return <div>{imageSrc && <img src={imageSrc} alt="Image" />}</div>;
};

export default ImageDisplay;
