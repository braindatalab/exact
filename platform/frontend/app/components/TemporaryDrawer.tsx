import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DatasetIcon from "@mui/icons-material/Dataset";
import CodeIcon from "@mui/icons-material/Code";
import CommentIcon from "@mui/icons-material/Comment";
import Link from "next/link";
import { IconWorldUpload } from "@tabler/icons-react";

type TemporaryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const drawerItems = [
  { text: "Home", icon: HomeIcon, href: "/" },
  { text: "Competitions", icon: EmojiEventsIcon, href: "/competitions" },
  { text: "Datasets", icon: DatasetIcon, href: "/datasets" },
  { text: "Code", icon: CodeIcon, href: "/code" },
  { text: "Discussions", icon: CommentIcon, href: "/discussions" },
  {
    text: "New Competition",
    icon: IconWorldUpload,
    href: "/competitions/create",
  },
];

const TemporaryDrawer: React.FC<TemporaryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const list = () => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {drawerItems.map(({ text, icon: IconComponent, href }, index) => (
          <Link key={text} href={href} passHref>
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      {list()}
    </Drawer>
  );
};

export default TemporaryDrawer;
