import React from 'react';
import {Box, Button, IconButton, InputAdornment, MenuItem, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const fieldStyles = {'& .MuiOutlinedInput-root': {bgcolor: 'background.paper'}};

// The search box and filters. Using any of them lists everything below the folder instead of its own contents.
function BrowserFilters({text, onTextChange, params, onChange, onClear, folderName}) {
  const active = text || params.type !== 'all' || params.modified !== 'any' || params.area !== 'all';

  const select = (name, label, options, minWidth) => (
    <TextField select size="small" label={label} value={params[name]} onChange={(event) => onChange({[name]: event.target.value})}
      sx={{...fieldStyles, minWidth}}>
      {Object.entries(options).map(([value, optionLabel]) => <MenuItem key={value} value={value}>{optionLabel}</MenuItem>)}
    </TextField>
  );

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center'}}>
      <TextField
        size="small"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder={`Search everything in ${folderName || 'this folder'}`}
        inputProps={{'aria-label': 'Search'}}
        sx={{...fieldStyles, flex: '1 1 260px', maxWidth: 460}}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>,
          endAdornment: text ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="Clear search" onClick={() => onTextChange('')}><CloseIcon fontSize="small"/></IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      {select('type', 'Type', {all: 'All types', folder: 'Folders', file: 'Files'}, 130)}
      {select('modified', 'Last modified', {any: 'Any time', today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', custom: 'Custom range'}, 160)}
      {params.modified === 'custom' && (
        <>
          <TextField type="date" size="small" label="From" value={params.from} onChange={(event) => onChange({from: event.target.value})}
            InputLabelProps={{shrink: true}} sx={fieldStyles}/>
          <TextField type="date" size="small" label="To" value={params.to} onChange={(event) => onChange({to: event.target.value})}
            InputLabelProps={{shrink: true}} sx={fieldStyles}/>
        </>
      )}
      {select('area', 'Area', {all: 'All areas', backup: 'Backups', stock: 'Stock', software: 'Software'}, 140)}
      {active && <Button size="small" onClick={onClear}>Clear</Button>}
    </Box>
  );
}

export default BrowserFilters;
