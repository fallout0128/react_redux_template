import React, { useState, useEffect } from 'react'

export default function() {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prevCount => prevCount + 1); // <-- Change this line!
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [])

  return (
    <div>
      {counter} secs
    </div>
  )
}