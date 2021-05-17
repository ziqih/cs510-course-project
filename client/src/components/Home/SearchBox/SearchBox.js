import React from 'react';
import ReactSearchBox from 'react-search-box'

export const parseSearchBoxData = (data) => {
    var records = [];
    for (var i = 0; i < data.length; i++) {
        records.push({"key": data[i], "value":data[i]});
    }
    return records;
}

const SearchBox = ({ placeholder, data, setRecordKey }) => {
    return (
        <div className="homeInput">
            <ReactSearchBox
            placeholder={placeholder}
            data={data}
            onSelect={record => setRecordKey(record.key)}
            fuseConfigs={{
            threshold: 0.05,
            }}
            value=""
            />
        </div>
    )
}

export default SearchBox;