import { Dialog, Typography, useAutocomplete } from "@mui/material"
import { UserAuth } from "../../context/AuthContext";

export default function ChatMemberPopup({member,...props}) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog 
      onClose={handleClose} 
      open={open} 
      
      >
      <div className="flex flex-col p-5 items-center space-y-5">
        <img className="w-max rounded-full" src={member?.picture} referrerPolicy='no-referrer' />
        <Typography variant="h5">{member?.name}</Typography>
        <Typography variant="h6">{member?.email}</Typography>
      </div>
    </Dialog>
  );
}