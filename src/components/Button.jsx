import styled from 'styled-components'

export const StyledButton = styled.button`
  background-color: black;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
`;

export default function Button({children, clickFn}) {
  return (
    <StyledButton onClick={clickFn}>
      {children}
    </StyledButton>
  )
  
}

