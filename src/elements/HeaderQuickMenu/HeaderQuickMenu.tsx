import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Icon, Text } from "../../components";

import { BLACK, WHITE, Z_INDEX } from "../../constants";
import { useModal } from "../../hooks/useModal";
import { useAudience } from "../../hooks/useAudience";
import { useHasTanks } from "../../hooks/useTanks";

export const HeaderQuickMenu = ({ showAddMenu, setShowAddMenu }) => {
  const { openModal } = useModal();

  const { isReef } = useAudience();

  const hasTanks = useHasTanks();

  const handleCreateTank = () => {
    openModal({
      type: "tankModal",
      modalTitle: "Create Tank",
      height: "large",
    });
  };

  const handleAddTest = () => {
    setShowAddMenu(false);
    hasTanks
      ? openModal({
          type: "homeTestCreateModal",
          modalTitle: "Home Test",
          height: "large",
          data: {
            quickMenu: true,
          },
        })
      : handleCreateTank();
  };
  const handleAddDosages = () => {
    setShowAddMenu(false);
    hasTanks
      ? openModal({
          type: "dosingCreateModal",
          modalTitle: "Dosing",
          height: "large",
          data: {
            quickMenu: true,
          },
        })
      : handleCreateTank();
  };

  const handleAddNdoc = () => {
    setShowAddMenu(false);
    hasTanks
      ? openModal({
          type: "ndocCreateModal",
          modalTitle: "N-DOC",
          height: "large",
          data: {
            quickMenu: true,
          },
        })
      : handleCreateTank();
  };

  const handleAddIcpTest = () => {
    setShowAddMenu(false);
    hasTanks
      ? openModal({
          type: "icpTestCreateModal",
          modalTitle: "ICP Test",
          height: "large",
          data: {
            quickMenu: true,
          },
        })
      : handleCreateTank();
  };

  const handleAddRoIcp = () => {
    setShowAddMenu(false);
    hasTanks
      ? openModal({
          type: "icpTestCreateModal",
          modalTitle: "RO ICP Test",
          height: "large",
          data: {
            quickMenu: true,
            ro: true,
          },
        })
      : handleCreateTank();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowAddMenu((prev) => !prev)}>
        <Icon name="reefDocsQuickMenu" width={32} height={32} fill={BLACK} />
      </TouchableOpacity>

      {showAddMenu && (
        <View style={styles.addMenu}>
          <TouchableOpacity onPress={handleAddTest}>
            <View style={styles.addMenuItem}>
              <Text>Add Home Test</Text>
            </View>
          </TouchableOpacity>
          {isReef && (
            <TouchableOpacity onPress={handleAddIcpTest}>
              <View style={styles.addMenuItem}>
                <Text>Add ICP</Text>
              </View>
            </TouchableOpacity>
          )}
          {isReef && (
            <TouchableOpacity onPress={handleAddRoIcp}>
              <View style={styles.addMenuItem}>
                <Text>Add RO ICP</Text>
              </View>
            </TouchableOpacity>
          )}
          {isReef && (
            <TouchableOpacity onPress={handleAddNdoc}>
              <View style={styles.addMenuItem}>
                <Text>Add N-DOC</Text>
              </View>
            </TouchableOpacity>
          )}
          {isReef && (
            <TouchableOpacity onPress={handleAddDosages}>
              <View style={styles.addMenuItem}>
                <Text>Add Dosages</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  addMenu: {
    position: "absolute",
    top: 50,
    right: -45,
    backgroundColor: WHITE,
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.headerQuickMenu,
    width: 140,
  },
  addMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});
