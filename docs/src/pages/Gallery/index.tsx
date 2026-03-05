import { useState } from "react"
import { Box, Divider, Modal, Typography } from "@mui/material"
import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { usePartsContext } from "../../contexts/parts/context"

const THUMB_HEIGHT = 150

const Gallery = () => {
    const { parts } = usePartsContext()
    const [expandedSrc, setExpandedSrc] = useState<string | null>(null)

    const partsWithImages = parts.filter((p) => p.images && p.images.length > 0)

    return (
        <PageWrapper title="Gallery">
            {partsWithImages.length === 0 && (
                <Typography color="text.secondary">No part images yet. Run the generator to copy images from the models.</Typography>
            )}
            {partsWithImages.map((part) => (
                <Box key={`${part.section}/${part.name}`} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {part.section} – {part.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {(part.images ?? []).map((relPath) => {
                            const src = `/${relPath.replace(/\\/g, "/")}`
                            return (
                                <Box
                                    key={src}
                                    component="img"
                                    src={src}
                                    alt=""
                                    loading="lazy"
                                    onClick={() => setExpandedSrc(src)}
                                    sx={{
                                        height: THUMB_HEIGHT,
                                        width: "auto",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        cursor: "pointer",
                                        borderRadius: 1,
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                />
                            )
                        })}
                    </Box>
                    <Divider sx={{ mt: 3 }} />
                </Box>
            ))}
            <Modal open={!!expandedSrc} onClose={() => setExpandedSrc(null)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                <Box
                    component="span"
                    onClick={() => setExpandedSrc(null)}
                    sx={{
                        outline: "none",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {expandedSrc ? (
                        <img
                            src={expandedSrc}
                            alt=""
                            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : null}
                </Box>
            </Modal>
        </PageWrapper>
    )
}

export default Gallery
