import { useCallback, useState } from 'react';

function useToggle(initialValue = false): [boolean, () => void] {
  const [toggle, setToggle] = useState(initialValue);

  return [toggle, useCallback(() => setToggle((status) => !status), [])];
}

export default useToggle;
