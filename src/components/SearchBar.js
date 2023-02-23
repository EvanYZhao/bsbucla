import {
  Autocomplete,
  Paper,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { queryCoursePrefix } from "../database/mongodb";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ setcourseid, ...props }) {
  const [courses, setCourses] = useState([]);
  const [inputTextValue, setInputTextValue] = useState("");
  const [currentCourse, setCurrentCourse] = useState({});
  const { user } = UserAuth();
  const navigate = useNavigate();

  /**
   * Sorts course data based on
   * @param {*} data
   * @param {*} prefix
   * @returns
   */
  const sortByWordPrefix = (data, prefix) => {
    prefix = prefix.trim();
    const sortedData = data.sort((a, b) => {
      const numA = parseInt(a.number.replace(/\D/g, ""));
      const numB = parseInt(b.number.replace(/\D/g, ""));
      const labelAWords = a.subjectLabel.toLowerCase().split(" ");
      const labelBWords = b.subjectLabel.toLowerCase().split(" ");
      const maxLabelWords = Math.max(labelAWords.length, labelBWords.length);
      for (let i = 0; i < maxLabelWords; i++) {
        if (i >= labelAWords.length) return -1;
        if (i >= labelBWords.length) return 1;
        if (
          labelAWords[i].startsWith(prefix) &&
          labelBWords[i].startsWith(prefix)
        ) {
          continue;
        }
        if (labelAWords[i].startsWith(prefix)) {
          return -1;
        }
        if (labelBWords[i].startsWith(prefix)) {
          return 1;
        }
      }

      if (
        a.subjectLabel.toLowerCase().includes(prefix) &&
        b.subjectLabel.toLowerCase().includes(prefix)
      ) {
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
  };

  /**
   * Searches the local storage or queries a database for objects with a
   * property containing a word
   * @param {*} word Word to be matched against
   */
  const searchByWord = async (word) => {
    // Clear cache when search is empty
    if (word.length === 0) {
      localStorage.removeItem(props.cachename);
      return;
    }

    // First check if cached
    word = word.toLowerCase();
    const pattern = new RegExp(`(^| )${word}`);
    const oldData = JSON.parse(localStorage.getItem(props.cachename));
    if (oldData && oldData.length >= 5) {
      const filteredOldData = oldData.filter((doc) => {
        if (doc.label.toLowerCase().match(pattern)) return true;
        else return false;
      });
      setCourses(sortByWordPrefix(filteredOldData, word).slice(0, 5));
      return;
    }

    // Query if not cached
    const jwt = user?.accessToken;
    const newData = await queryCoursePrefix(word, jwt);
    for (const data of newData) {
      data.label = data.subjectLabel + " " + data.number + " " + data.name;
    }
    setCourses(sortByWordPrefix(newData, word).slice(0, 5));
    localStorage.setItem(props.cachename, JSON.stringify(newData));
  };

  /**
   * Renders the SearchBar input field base
   * @param {*} params TextField params
   * @returns {Paper} `Paper` component
   */
  const SearchBarInputBase = (params) => {
    return (
      <Paper
        component="form"
        sx={{ display: "flex", alignItems: "center" }}
        ref={params.InputProps.ref}
      >
        <TextField
          {...params}
          variant="standard"
          placeholder="Search Courses"
          value={inputTextValue}
          sx={{ padding: "10px" }}
          inputProps={params.inputProps}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    );
  };

  /**
   * Handles rendering each row in the SearchBar dropdown
   * @param {*} props The props to apply to the `li` element
   * @param {*} option The option to render
   * @returns {JSX.IntrinsicElements.li} `li` element
   */
  const handleRenderOption = (props, option) => {
    return (
      <li {...props}>
        <Box>{option.label}</Box>
      </li>
    );
  };

  /**
   * Navigates to page with course data
   * @param {*} e The value returned from search box submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/course/${currentCourse._id}`, {
      state: currentCourse,
    });
  };

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
        sx={{ width: props.width }}
        renderInput={SearchBarInputBase}
        onInputChange={(e, value) => {
          searchByWord(value);
          setInputTextValue(value);
        }}
        onChange={(e, value) => {
          setCourses(value ? [value] : []);
          setcourseid(value?._id);
          setCurrentCourse(value);
        }}
        renderOption={handleRenderOption}
        onSubmit={handleSubmit}
      ></Autocomplete>
    </div>
  );
}

SearchBar.defaultProps = {
  width: 300,
  cachename: "labels",
  setcourseid: () => {},
};
