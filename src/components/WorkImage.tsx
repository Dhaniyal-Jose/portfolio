import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
  description?: string;
  onClickDescription?: () => void;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link || "#"}
        onClick={(e) => {
          if (props.description && props.onClickDescription) {
            e.preventDefault();
            props.onClickDescription();
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target={props.link ? "_blank" : undefined}
        rel={props.link ? "noopener noreferrer" : undefined}
        data-cursor={"disable"}
      >
        {(props.link || props.description) && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        <img src={props.image} alt={props.alt} />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
