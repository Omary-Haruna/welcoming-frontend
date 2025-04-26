import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconButton, Tooltip } from "@mui/material";
import { MdDarkMode, MdLightMode } from "react-icons/md"; // Compact icons

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Tooltip title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"} arrow>
            <IconButton
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                size="small"
                sx={{
                    color: theme === "light" ? "#000" : "#fff", // Set color based on theme
                    transition: "color 0.3s ease", // Smooth transition for color change
                    "&:hover": {
                        color: theme === "light" ? "#f5a623" : "#4caf50", // Change color on hover
                    },
                }}
            >
                {theme === "light" ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
