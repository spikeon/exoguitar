import { useState } from "react"
import { Box, Card, CardContent, Divider, IconButton, Modal, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { usePartsContext } from "../../contexts/parts/context"

const THUMB_HEIGHT = 150

/** Path segment for "exploded views" folder (script uses underscore in output paths). */
const EXPLODED_VIEWS_SEGMENT = "exploded_views"

/** Exclude images in the "exploded views" folder from gallery display; they remain in part.images. */
function isGalleryImage(relPath: string): boolean {
    const normalized = relPath.replace(/\\/g, "/")
    return !normalized.includes(EXPLODED_VIEWS_SEGMENT)
}

const Gallery = () => {
    const { parts } = usePartsContext()
    const [expandedSrc, setExpandedSrc] = useState<string | null>(null)

    const partsWithImages = parts
        .map((p) => ({ part: p, galleryImages: (p.images ?? []).filter(isGalleryImage) }))
        .filter(({ galleryImages }) => galleryImages.length > 0)

    return (
        <PageWrapper title="Gallery">
            {partsWithImages.length === 0 && (
                <Typography color="text.secondary">No part images yet. Run the generator to copy images from the models.</Typography>
            )}
            {partsWithImages.map(({ part, galleryImages }) => (
                <Box key={`${part.section}/${part.name}`} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {part.section} – {part.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "space-between" }}>
                        {galleryImages.map((relPath) => {
                            const normalized = relPath.replace(/\\/g, "/");
                            const src = `${process.env.PUBLIC_URL || ""}/${normalized}`.replace(/\/+/g, "/");
                            return (
                                <Card
                                    key={src}
                                    sx={{
                                        cursor: "pointer",
                                        height: THUMB_HEIGHT,
                                        overflow: "hidden",
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                    onClick={() => setExpandedSrc(src)}
                                >
                                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                        <Box
                                            component="img"
                                            src={src}
                                            alt=""
                                            loading="lazy"
                                            sx={{
                                                height: THUMB_HEIGHT,
                                                width: "auto",
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Box>
                    <Divider sx={{ mt: 3 }} />
                </Box>
            ))}
            <Modal open={!!expandedSrc} onClose={() => setExpandedSrc(null)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                <Card
                    sx={{
                        outline: "none",
                        maxWidth: "100%",
                        maxHeight: "90vh",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconButton
                        aria-label="Close"
                        onClick={() => setExpandedSrc(null)}
                        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "background.paper" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {expandedSrc ? (
                        <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                            <Box
                                component="img"
                                src={expandedSrc}
                                alt=""
                                sx={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain" }}
                            />
                        </CardContent>
                    ) : null}
                </Card>
            </Modal>
        </PageWrapper>
    )
}

export default Gallery
