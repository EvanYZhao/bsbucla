import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import Database from "../database/firestore";

export default function SearchBar() {
    const courseDB = new Database('courses');
    const [courses, setCourses] = useState([]);

    const searchPrefix = (prefix) => {
        if (prefix === '')
            prefix = '\uf8ff';
        else
            prefix = prefix.toLowerCase();

        console.log(prefix);
        courseDB.queryPrefix({'course-name-query': prefix.toLowerCase()}, undefined, 5)
        .then((docs) => {
            const courseNameList = docs.map((course) => course['subject-name'] + ' ' + course['course-number'] + ': ' + course['course-name']);
            setCourses(courseNameList);
        })
    }

    return (
        <div className="searchbar-container">
            <Autocomplete
                disablePortal
                freeSolo
                id="combo-box-demo"
                options={courses}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search for course"/>}
                onInputChange={(e, value) => {
                    searchPrefix(value);
                }}
            >
            </Autocomplete>
        </div>
    );
}