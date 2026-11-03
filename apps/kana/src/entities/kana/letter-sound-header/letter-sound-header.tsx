import React from "react";

import { lettersTableById } from "@nihongo/core/shared/data/lettersTable";
import { StyleSheet, View } from "react-native";

import SoundLetter from "@/entities/kana/sound-letter/sound-letter";
import SymbolHeader from "@/entities/kana/symbol-header/symbol-header";
import { KanaAlphabet } from "@/shared/constants/kana";

const SOUND_BUTTON_SIZE = 48;

type LetterSoundHeaderProps = {
  id: string;
  kana: KanaAlphabet;

  width: number;
};

const LetterSoundHeader: React.FC<LetterSoundHeaderProps> = ({ id, kana, width }) => (
  <View style={[styles.container, { width }]}>
    <SymbolHeader kana={kana} letter={lettersTableById[id]} />

    <View style={styles.sound}>
      <SoundLetter id={id} color="primary" width={SOUND_BUTTON_SIZE} />
    </View>
  </View>
);

export default LetterSoundHeader;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",

    paddingTop: 16,
    paddingBottom: 16,
  },
  sound: {
    position: "absolute",
    right: 0,
    bottom: 16,
  },
});
