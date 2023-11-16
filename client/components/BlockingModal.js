import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

const BlockingModal = ({
    blockingModalVisible,
    setBlockingModalVisible,
    blockedUser,
    handleBlockConfirmation,
  }) => (
  <Modal
    visible={blockingModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setBlockingModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text>Are you sure you want to block {blockedUser.username}?</Text>
        <View style={styles.modalButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#555' : '#888' },
            ]}
            onPress={() => setBlockingModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#555' : '#888' },
            ]}
            onPress={handleBlockConfirmation}
          >
            <Text style={styles.buttonText}>Block</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BlockingModal;
