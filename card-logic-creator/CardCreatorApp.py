import tkinter as tk
from tkinter import ttk
import json

class CardCreatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Card Creator")

        # Attributes
        self.card_name_var = tk.StringVar()
        self.card_type_var = tk.StringVar()
        self.attribute_entries = []
        self.effects = ["DealDamage", "Heal", "DrawCards"]  # Example list of effects
        self.conditions = ["TrueCondition", "PlayerHealthBelowThreshold"]  # Example list of conditions
        self.costs = ["NoCost", "DiscardCost", "LifeCost"]

        # Card Details Frame
        details_frame = ttk.LabelFrame(self.root, text="Card Details")
        details_frame.grid(row=0, column=0, padx=10, pady=10, sticky="w")

        ttk.Label(details_frame, text="Name:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
        ttk.Entry(details_frame, textvariable=self.card_name_var, width=30).grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(details_frame, text="Type:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
        ttk.Entry(details_frame, textvariable=self.card_type_var, width=30).grid(row=1, column=1, padx=5, pady=5)

        # Effects and Conditions Frame
        self.effects_frame = ttk.LabelFrame(self.root, text="Effects and Conditions")
        self.effects_frame.grid(row=1, column=0, padx=10, pady=10, sticky="w")

        self.effect_label = ttk.Label(self.effects_frame, text="Effect:")
        self.effect_label.grid(row=0, column=0, padx=5, pady=5, sticky="e")

        self.effect_combobox = ttk.Combobox(self.effects_frame, values=self.effects, width=20, state="readonly")
        self.effect_combobox.grid(row=0, column=1, padx=5, pady=5)
        self.effect_combobox.bind("<<ComboboxSelected>>", self.update_cost_and_condition_options)

        self.condition_label = ttk.Label(self.effects_frame, text="Condition:", state="disabled")
        self.condition_label.grid(row=1, column=0, padx=5, pady=5, sticky="e")

        self.condition_combobox = ttk.Combobox(self.effects_frame, values=[], width=20, state="disabled")
        self.condition_combobox.grid(row=1, column=1, padx=5, pady=5)

        self.condition_label = ttk.Label(self.effects_frame, text="Cost:", state="disabled")
        self.condition_label.grid(row=2, column=0, padx=5, pady=5, sticky="e")

        self.cost_combobox = ttk.Combobox(self.effects_frame, values=[], width=20, state="disabled")
        self.cost_combobox.grid(row=2, column=1, padx=5, pady=5)

        ttk.Label(self.effects_frame, text="Effect Args:").grid(row=0, column=2, padx=5, pady=5, sticky="e")
        self.effect_arg_var = tk.StringVar()
        ttk.Entry(self.effects_frame, textvariable=self.effect_arg_var, width=20).grid(row=0, column=3, padx=5, pady=5)

        ttk.Label(self.effects_frame, text="Condition Args:").grid(row=1, column=2, padx=5, pady=5, sticky="e")
        self.condition_arg_var = tk.StringVar()
        ttk.Entry(self.effects_frame, textvariable=self.condition_arg_var, width=20).grid(row=1, column=3, padx=5, pady=5)

        ttk.Label(self.effects_frame, text="Cost Args:").grid(row=2, column=2, padx=5, pady=5, sticky="e")
        self.condition_arg_var = tk.StringVar()
        ttk.Entry(self.effects_frame, textvariable=self.condition_arg_var, width=20).grid(row=2, column=3, padx=5, pady=5)

        # Attributes Frame
        attributes_frame = ttk.LabelFrame(self.root, text="Attributes")
        attributes_frame.grid(row=0, column=1, rowspan=2, padx=10, pady=10, sticky="nsew")

        self.attribute_count = 0

        def add_attribute():
            attribute_name = tk.StringVar()
            attribute_value = tk.StringVar()
            self.attribute_entries.append((attribute_name, attribute_value))

            ttk.Label(attributes_frame, text="Name:").grid(row=self.attribute_count, column=0, padx=5, pady=5, sticky="e")
            ttk.Entry(attributes_frame, textvariable=attribute_name, width=15).grid(row=self.attribute_count, column=1, padx=5, pady=5)

            ttk.Label(attributes_frame, text="Value:").grid(row=self.attribute_count, column=2, padx=5, pady=5, sticky="e")
            ttk.Entry(attributes_frame, textvariable=attribute_value, width=15).grid(row=self.attribute_count, column=3, padx=5, pady=5)

            self.attribute_count += 1

        ttk.Button(attributes_frame, text="Add Attribute", command=add_attribute).grid(row=self.attribute_count, column=0, columnspan=4, padx=5, pady=5)

        # Save Button
        ttk.Button(self.root, text="Save Card", command=self.save_card).grid(row=2, column=0, columnspan=2, padx=10, pady=10)

    def update_cost_and_condition_options(self, event=None):
        selected_effect = self.effect_combobox.get()

        if selected_effect == "DealDamage":
            self.condition_combobox.config(values=self.conditions, state="readonly")
            self.cost_combobox.config(value=self.costs, state="readonly")
            self.condition_label.config(state="normal")
        elif selected_effect == "Heal":
            self.condition_combobox.config(values=self.conditions, state="readonly")
            self.cost_combobox.config(value=self.costs, state="readonly")
            self.condition_label.config(state="normal")
        elif selected_effect == "DrawCards":
            self.condition_combobox.config(values=self.conditions, state="readonly")
            self.costs_combobox.config(value=self.costs, state="readonly")
            self.condition_label.config(state="normal")

    def save_card(self):
        card_name = self.card_name_var.get()
        card_type = self.card_type_var.get()

        attributes = {}
        for entry in self.attribute_entries:
            name = entry[0].get()
            value = entry[1].get()
            if value.isdigit():
                attributes[name] = int(value)
            else:
                attributes[name] = value

        effect = self.effect_combobox.get()
        effect_args = self.effect_arg_var.get().split(",") if self.effect_arg_var.get() else []
        condition = self.condition_combobox.get()
        condition_args = self.condition_arg_var.get().split(",") if self.condition_combobox.get() else []
        cost = self.cost_combobox.get()
        cost_args = self.condition_arg_var.get().split(",") if self.cost_combobox.get() else []

        # Convert numeric args to integers
        effect_args = [int(arg) if arg.isdigit() else arg for arg in effect_args]
        condition_args = [int(arg) if arg.isdigit() else arg for arg in condition_args]
        cost_args = [int(arg) if arg.isdigit() else arg for arg in cost_args]

        # Constructing the card data in the specified format
        card_data = {
            "Name": card_name,
            "EffectsWithConditions": [
                {
                    "EffectName": effect if effect != "" else "NoEffect",
                    "ConditionName": condition if condition != "" else "TrueCondition",
                    "CostName": cost if cost != "" else "NoCost",
                    "EffectArgs": effect_args,
                    "ConditionArgs": condition_args,
                    "CostArgs": cost_args
                }
            ],
            "Attributes": attributes
        }

        filename = "cards.json"

        try:
            with open(filename, "r") as f:
                data = json.load(f)
        except FileNotFoundError:
            data = []

        # Step 2: Append the new data to the existing data
        data.append(card_data)

        # Step 3: Write the updated data back to the file
        with open(filename, "w") as f:
            json.dump(data, f, indent=2)


if __name__ == "__main__":
    root = tk.Tk()
    app = CardCreatorApp(root)
    root.mainloop()
