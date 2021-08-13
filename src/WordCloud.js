import { useState } from 'react';
import Select from 'react-select';
import ReactWordcloud from 'react-wordcloud';
import getWrdFrequency from './helpers/dataFormatters';

function getWordCloudComponent(words) {
  const options = {
    // colors: ['#7209B7', '#560BAD', '#480CA8', '#3A0CA3', '#3A0CA3', '#4361EE'],
    colors: [
      '#2B44FF',
      '#324EFC',
      '#405FF8',
      '#5277F1',
      '#658EEB',
      '#89BCDF',
      '#A0DAD7',
      '#BBFDCE',
    ],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'impact',
    fontSizes: [10, 70],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 0.5,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'rectangular',
    transitionDuration: 1000,
  };
  return <ReactWordcloud words={words} options={options} />;
}

const getWordFrequency = (wordFreqPerUser, selectedUser) =>
  wordFreqPerUser[selectedUser];

const WordCloud = ({ wordFreqPerUser, userNames, isLoading }) => {
  const [selectedUser, setSelectedUser] = useState({
    label: 'All Members',
    value: '',
  });
  let selectOptions = userNames.map((user) => ({ value: user, label: user }));
  selectOptions = [
    { value: '', label: 'All Members', isSelected: true },
    ...selectOptions,
  ];

  const handleChange = (selectedOption, action) => {
    if (action && action.action === 'clear') {
      setSelectedUser({
        label: 'All Members',
        value: '',
      });
    } else {
      setSelectedUser(selectedOption);
    }
  };
  return (
    <div className="py-1 px-3">
      <div className="flex items-center">
        <div className="text-sm text-dark font-bold w-1/2">
          Most used words{' '}
        </div>
        <Select
          className="select w-1/2"
          isClearable
          isSearchable
          isLoading={isLoading}
          options={selectOptions}
          value={{ ...selectedUser }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            padding: '4px',
            colors: {
              ...theme.colors,
              primary: 'black',
            },
          })}
          onChange={handleChange}
        />
      </div>
      {getWordCloudComponent(
        getWordFrequency(wordFreqPerUser, selectedUser.value)
      )}
    </div>
  );
};

export default WordCloud;
