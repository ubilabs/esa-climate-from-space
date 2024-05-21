import {useContext} from 'react';
import {ChapterContext} from '../provider/chapter-provider';

export const useChapter = () => useContext(ChapterContext);
