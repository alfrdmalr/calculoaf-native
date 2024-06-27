import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import { getReagentLabel } from "../types/reagent";
import { Ingredients, validateIngredients } from "../types/ingredients";
import { Nullable } from "../types/nullable";
import { Numberish } from "../types/numberish";
import { getTotalDoughMass } from "../functions/getTotalMass";
import { ThemedText } from "@/components/ThemedText";

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const { ingredients } = props;

  const { levainMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  const totalDoughMass: Numberish = useMemo(() => {
    return getTotalDoughMass(ingredients);
  }, [ingredients]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>Ingredient Totals</ThemedText>
      <View>
        <View>
          <View style={styles.row}>
            <ThemedText>Ingredient Name</ThemedText>
            <ThemedText>Mass ({unit})</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText>{getReagentLabel("flourMass")}</ThemedText>
            <ThemedText>{flourMass?.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText>{getReagentLabel("waterMass")}</ThemedText>
            <ThemedText>{waterMass?.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText>{getReagentLabel("levainMass")}</ThemedText>
            <ThemedText>{levainMass?.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText>{getReagentLabel("saltMass")}</ThemedText>
            <ThemedText>{saltMass?.toFixed(2)}</ThemedText>
          </View>
        </View>
        <View>
          <View style={styles.row}>
            <ThemedText>Total Dough</ThemedText>
            <ThemedText>{totalDoughMass?.toFixed(2)}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: 'white'
  },
  row: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    color: 'white',
    gap: 16
  },
  header: {
    width: "100%",
    textAlign: 'center',
    fontSize: 20
  }

});
