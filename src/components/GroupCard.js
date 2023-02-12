import {Button, Card} from "@mui/material";

export default function GroupCard({groupName, peopleNum, peopleTotal}){
    return(
        <Card 
            sx = {{minWidth: 275, maxWidth: 100}}
        >
            <CardContent>
                {groupName}
            </CardContent>
            <CardContent>
                {peopleNum}/{peopleTotal}
            </CardContent>
            <CardActions>
                <Button>Join</Button>
            </CardActions>
        </Card>
    );
}

//do an onclick for the button to display the group page?