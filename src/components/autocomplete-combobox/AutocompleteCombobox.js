import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function AutocompleteCombobox({id, label, options, showDebugInfo, onValueChanged, selectedValue = null}) {
    const [value, setValue] = React.useState(selectedValue);
    const [inputValue, setInputValue] = React.useState('');
    return (
        <div>
            {showDebugInfo === true ? <div>{`value: ${value !== null ? `'${value.id}'` : 'null'}`}</div> : ''}
            {showDebugInfo === true ? <div>{`inputValue: '${inputValue}'`}</div> : ''}
            {showDebugInfo === true ? <br /> : ''}
            <Autocomplete
                value={value}
                getOptionLabel={option => option.label}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    if (onValueChanged != null) {
                        if (newValue === null){
                            onValueChanged(null);
                        } else {
                            onValueChanged(newValue);
                        }
                    }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id={id}
                options={options}
                renderInput={(params) => <TextField {...params} label={label} />}
            />
        </div>
    );
}