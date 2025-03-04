import { Card } from "antd";
import "./index.css";

interface VideoPlayerProps {
  src: string | undefined;
}

const Player: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <Card
      className="video-player-container"
      bordered={false}
      style={{ padding: "none" }}
    >
      <video controls src={src} className="video-player" />
    </Card>
  );
};

export default Player;
