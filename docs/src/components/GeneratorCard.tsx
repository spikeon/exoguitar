import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

type GeneratorCardProps = {
    onClick: () => void,
    image: string | undefined,
    title: string
}

const GeneratorCard = ({
    onClick,
    image,
    title
}: GeneratorCardProps) => (
    <Card>
        <CardActionArea onClick={onClick}>
            {image && (
                <CardMedia
                    component="img"
                    height="260px"
                    image={image}
                    alt=""
                    />
            )}
            <CardContent>
                <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="div"
                    align="center">
                    {title}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
)


export default GeneratorCard;