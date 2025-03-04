import React from "react";
import { Film } from "../../../types/films";
import { Card, Col, Grid, Row, Space } from "antd";
import { useNavigate } from "react-router-dom";

interface FilmsPageProps {
  films: Film[];
}

const { Meta } = Card;

const FilmsPage: React.FC<FilmsPageProps> = ({ films }) => {
  const navigate = useNavigate();
    console.log(films);
  return (
    <div>
      <Row gutter={[16, 24]}>
        {films.map((film) => (
          <Col key={film.id} span={4}>
            <Card
              hoverable
              cover={
                <img
                  alt={film.title}
                  src={film.image}
                  style={{ height: 160, objectFit: "cover" }}
                />
              }
              onClick={() => navigate(`/film/${film.id}`)}
            >
              <Meta title={film.title} description={film.year} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilmsPage;
