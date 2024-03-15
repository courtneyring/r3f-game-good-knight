import styled from 'styled-components'
import Button from './Button';


const ModalContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color:rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Close = styled(Button)`
  position: absolute;
  right: 5px;
  top: 5px;
`;

const ModalBody = styled.div`
  background-color: white;
  padding: 10px;
  max-width: 60%;
  position: relative;
`;

export default function Modal({ children,  closeFn}) {
  return (

    <ModalContainer>
      <ModalBody>
        <Close clickFn={closeFn}>X</Close>
        {children}
      </ModalBody>
    </ModalContainer>


  )
}