import React from 'react'
import { useSearchParams } from 'react-router-dom'
import FolderBrowser from '../../../components/folder/browser/FolderBrowser'

function Folder() {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('f') || '';

  // Each folder opens fresh: no search, filters or paging carried over from the previous one.
  return (
    <FolderBrowser key={folderId} folderId={folderId}/>
  )
}

export default Folder
