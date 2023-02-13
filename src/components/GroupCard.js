import {Button, Card} from "@mui/material";

export default function GroupCard({groupName, peopleNum, peopleTotal, groupID}){
    return(
        <Card 
            sx = {{minWidth: 275, maxHeight: 100}}
        >
            <CardContent>
                {groupName}
            </CardContent>
            <CardContent>
                {peopleNum}/{peopleTotal} people
            </CardContent>
            <CardActions>
                <Button>Join</Button>
            </CardActions>
        </Card>
    );
}

//do an onclick for the button to route to the group page?
//would you need the group id too?