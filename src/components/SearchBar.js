import { Autocomplete, Paper, TextField, IconButton, InputAdornment, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import Database from "../database/firestore";

export default function SearchBar({props}) {
    const courseDB = new Database('course-labels');
    const [courses, setCourses] = useState([]);
    const [inputTextValue, setInputTextValue] = useState('');
    const [optionIndex, setOptionIndex] = useState(0);
    const [mouseOver, setMouseOver] = useState(false);

    const sortByWordPrefix = (data, prefix) => {
        const sortedData = data.sort((a, b) => {
            const wordsA = a.label.toLowerCase().split(' ');
            const wordsB = b.label.toLowerCase().split(' ');
            const len = Math.max(wordsA.length, wordsB.length);
            for (let i = 0; i < len; i++) {
                if (i >= wordsA.length)
                    return 1;
                if (i >= wordsB.length)
                    return -1;
                if (wordsA[i].startsWith(prefix) && wordsB[i].startsWith(prefix)) {
                    return wordsA[i] < wordsB[i] ? -1 : 1;
                }
                if (wordsA[i].startsWith(prefix))
                    return -1;
                if (wordsB[i].startsWith(prefix))
                    return 1;
            }
            if (a.label > b.label)
                return 1;
            if (a.label < b.label)
                return -1;
            return 0;
        });
        return sortedData;
    }

    const searchPrefix = async (prefix) => {
        // First check if in local storage
        prefix = prefix.toLowerCase();
        const oldData = JSON.parse(localStorage.getItem('course-labels'));
        if (oldData) {
            const filteredOldData = oldData.filter((doc) => 
                doc.label.toLowerCase().includes(prefix)
            )
            setCourses(sortByWordPrefix(filteredOldData, prefix));
            return;
        }
        await courseDB.getCollection()
        .then((docs) => {
            setCourses(sortByWordPrefix(docs, prefix));
            localStorage.setItem('course-labels', JSON.stringify(docs));
        })
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
                InputProps={{...params.InputProps, disableUnderline: true, startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>}}
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