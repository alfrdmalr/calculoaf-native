import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View } from 'react-native';
import { FormulaForm } from './formulaForm';
import { useCallback, useState } from 'react';
import { Nullable } from './types/nullable';
import { Ingredients, emptyIngredients, validateIngredients } from './types/ingredients';
import { Formula, validateFormula } from './types/formula';
import { getTotalDoughMass } from './functions/getTotalMass';
import { applyFormulaTDM } from './functions/applyFormula';
import { IngredientsForm } from './ingredientsForm';
import { TotalIngredients } from './totalIngredients';

export default function Calculoaf() {

  const [ingredients, setIngredients] = useState<Nullable<Ingredients>>(
    emptyIngredients()
  );
  const [formula, setFormula] = useState<Nullable<Formula>>({
    hydrationPercent: 80,
    levainPercent: 25,
    saltPercent: 2,
  });

  const updateFormula = useCallback(
    (formula: Nullable<Formula>) => {
      setFormula(formula);
      if (validateFormula(formula) && validateIngredients(ingredients)) {
        // TODO using dough mass, but should allow user to hold an arbitrary
        // ingredient constant
        const doughMass = getTotalDoughMass(ingredients);
        if (doughMass !== null) {
          setIngredients(applyFormulaTDM(formula, doughMass));
        }
      }
    },
    [ingredients, setIngredients]
  );

  return (
    <View style={styles.main}>
      <ThemedText>Calculoaf</ThemedText>
      <ThemedText>
        A simple tool for adjusting bread formulas based on ingredient
        measurements, or vice versa.
      </ThemedText>

      <View style={styles.forms}>
        <View style={styles.formContainer}>
            <IngredientsForm
              formula={formula}
              ingredients={ingredients}
              updateIngredients={setIngredients}
            />
        </View>
        <View style={styles.formContainer}>
          <FormulaForm updateFormula={updateFormula} formula={formula} />
        </View>
      </View>
      <View style={styles.formContainer}>
        <TotalIngredients ingredients={ingredients} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  forms: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    width: '100%'
  },

  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  input: {
    marginBottom: 1
  }
});
