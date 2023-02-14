import { Autocomplete, Paper, TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { queryCoursePrefix } from "../database/mongodb";

export default function SearchBar({props}) {
    const [courses, setCourses] = useState([]);
    const [inputTextValue, setInputTextValue] = useState('');
    const [optionIndex, setOptionIndex] = useState(0);
    const [mouseOver, setMouseOver] = useState(false);

    const sortByWordPrefix = (data, prefix) => {
        prefix = prefix.trim();
        const sortedData = data.sort((a, b) => {
            const numA = parseInt(a.number.replace(/\D/g, ''));
            const numB = parseInt(b.number.replace(/\D/g, ''));
            const labelAWords = a.subjectLabel.toLowerCase().split(' ');
            const labelBWords = b.subjectLabel.toLowerCase().split(' ');
            const maxLabelWords = Math.max(labelAWords.length, labelBWords.length);
            for (let i = 0; i < maxLabelWords; i++) {
                if (i >= labelAWords.length)
                    return -1;
                if (i >= labelBWords.length)
                    return 1;
                if (labelAWords[i].startsWith(prefix) && labelBWords[i].startsWith(prefix)) {
                    continue;
                }
                if (labelAWords[i].startsWith(prefix)) {
                    return -1;
                }
                if (labelBWords[i].startsWith(prefix)) {
                    return 1;
                }
            }

            if (a.subjectLabel.toLowerCase().includes(prefix) && b.subjectLabel.toLowerCase().includes(prefix)) {
                return numA < numB ? -1 : 1;
            }
            if (a.subjectLabel.toLowerCase().includes(prefix)) {
                return -1;
            }
            if (b.subjectLabel.toLowerCase().includes(prefix)) {
                return 1;
            }

            if (prefix.includes(a.subject) && prefix.includes(b.subject)) {
                return numA < numB ? -1 : 1;
            }

            return 0;
        });
        return sortedData;
    }

    const searchPrefix = async (prefix) => {
        if (prefix.length === 1)
            localStorage.removeItem('courseLabels');
        // First check if in local storage
        prefix = prefix.toLowerCase().trim();
        const oldData = JSON.parse(localStorage.getItem('courseLabels'));
        if (oldData && oldData.length >= 5) {
            const filteredOldData = oldData.filter((doc) => doc.label.toLowerCase().includes(prefix));
            setCourses(sortByWordPrefix(filteredOldData, prefix).slice(0, 5));
            return;
        }
        const newData = await queryCoursePrefix(prefix);
        for (const data of newData) {
            data.label = data.subjectLabel + ' ' + data.number + ' ' + data.name;
        }
        setCourses(sortByWordPrefix(newData, prefix).slice(0, 5));
        localStorage.setItem('courseLabels', JSON.stringify(newData));
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
            default:
                break;
        }
    }

    const handleRenderOption = (props, option) => {
        return (
        <li {...props} 
            onMouseEnter={(e) => {setMouseOver(true); setOptionIndex(parseInt(props.id.split('-').at(2)));}}
            onMouseLeave={(e) => {setMouseOver(false)}}
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
                sx={{ width: 600 }}
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