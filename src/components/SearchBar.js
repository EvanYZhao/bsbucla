import { Autocomplete, Paper, TextField, IconButton, InputAdornment, Box } from "@mui/material";
import { useState } from "react";
import Database from "../database/firestore";

export default function SearchBar({props}) {
    const courseDB = new Database('courses');
    const [courses, setCourses] = useState([]);
    const [inputTextValue, setInputTextValue] = useState('');
    const [optionIndex, setOptionIndex] = useState(0);
    const [mouseOver, setMouseOver] = useState(false);

    const searchPrefix = async (prefix) => {
        // First check if in local storage
        const oldData = JSON.parse(localStorage.getItem('courses'));
        console.log(oldData);
        if (oldData) {
            for (const obj of oldData) {
                console.log(obj);
                if (obj['course-name'].toLowerCase().includes(prefix))
                    return;
            }
        }
        await courseDB.getCollection()
        .then((docs) => {
            console.log(docs);
            localStorage.setItem('courses', JSON.stringify(docs));
        })

        // const handleResults = (results, previousResults=[]) => {

        //     const newResults = results.map(
        //         (result) => {
        //             const subjectName = result['subject-name'].toUpperCase();
        //             const courseNum = result['course-number'].toUpperCase();
        //             const courseName = result['course-name'];
        //             return ({id: result['id'], label: `${subjectName} ${courseNum}: ${courseName}`})
        //         }
        //     );
        //     const filteredResults = [...previousResults, ...newResults].filter((elem, index, self) => 
        //         self.findIndex((t) => t.id === elem.id) === index
        //     );
        //     return filteredResults;
        // }
        // prefix = prefix === '' ? '\uf8ff' : prefix.toLowerCase();
        // let courseList = [];

        // courseDB.queryPrefix({'subject-name': prefix.toLowerCase()}, undefined, 5)
        // .then((courseDocsList) => {
        //     courseList = handleResults(courseDocsList);
        // })
        // .catch((e) => e)
        // .finally(() => {
        //     courseDB.queryPrefix({'course-name-query': prefix.toLowerCase()}, undefined, 5)
        //     .then((courseDocsList) => {
        //         courseList = handleResults(courseDocsList, courseList);
        //         setCourses(courseList);
        //     })
        //     .catch((e) => e)
        //     .finally(() => {
        //         courseDB.queryPrefix({'course-number': prefix.toLowerCase()}, undefined, 5)
        //         .then((courseDocsList) => {
        //             courseList = handleResults(courseDocsList, courseList);
        //             setCourses(courseList);
        //         })
        //         .catch((e) => {
        //             if (courseList.length == 0)
        //                 setCourses([]);
        //             else
        //                 setCourses(courseList);
        //             return e;
        //         });
        //     })
        // })
    }

    const SearchBarInputBase = (params) => {
        return (
        <Paper
            component="form"
            sx={{ display: 'flex', alignItems: 'center' }}
            ref={params.InputProps.ref}
        >
            <TextField
                {...params}
                variant="standard"
                placeholder="Search Courses"
                value={inputTextValue}
                sx={{ padding: '10px' }}
                inputProps={params.inputProps}
                InputProps={{...params.InputProps, disableUnderline: true}}
            />
        </Paper>
        );
    }

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'Tab':
                event.preventDefault();
                setOptionIndex((optionIndex + 1) % courses.length);
                break;
            case 'Enter':
                event.preventDefault();
                setInputTextValue(courses[optionIndex]);
                break;
        }
    }

    const handleRenderOption = (props, option) => {
        return (
        <li {...props} 
            onMouseEnter={(e) => setMouseOver(true)}
            onMouseLeave={(e) => {setMouseOver(false); setOptionIndex(parseInt(props.id.at(-1)))}}
            style={{ backgroundColor: ((props.id === `:r0:-option-${optionIndex}`) && !mouseOver) ? '#f5f5f5' : 'primary.main'}}
        >
            <Box>
            {option.label}
            </Box>
            
        </li>
        )
    }

    return (
        <div className="searchbar-container">
            <Autocomplete
                {...props}
                freeSolo
                disablePortal
                value={inputTextValue}
                PaperComponent={(props) => <Paper elevation={10} {...props} />}
                autoComplete={true}
                options={courses}
                sx={{ width: 500 }}
                onKeyDown={handleKeyDown}
                renderInput={SearchBarInputBase
              }
                onInputChange={(e, value) => {searchPrefix(value); setInputTextValue(value);} }
                onChange={(e, value) => setCourses(value ? [value] : [])}
                renderOption={handleRenderOption}
            >
            </Autocomplete>
        </div>
    );
}