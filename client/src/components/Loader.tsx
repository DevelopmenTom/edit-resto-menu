import { Center, Modal, ModalOverlay, Spinner } from '@chakra-ui/react'

export const Loader = () => {
  return (
    <Modal isOpen={true} onClose={() => undefined}>
      <ModalOverlay />
      <Center h={'100vh'} w={'100vw'} top={'0'} pos={'fixed'} zIndex={'1500'}>
        <Spinner
          thickness="6px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    </Modal>
  )
}
