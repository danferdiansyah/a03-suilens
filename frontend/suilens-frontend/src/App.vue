<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>SuiLens - Equipment Rental</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-8" max-width="1000">
        <v-row>
          <!-- Lens Catalog -->
          <v-col cols="12" md="7">
            <v-card>
              <v-card-title>Lens Catalog</v-card-title>
              <v-divider />
              <v-card-text>
                <div v-if="isLoading" class="text-center py-4">
                  <v-progress-circular indeterminate />
                </div>
                <div v-else-if="error" class="text-center text-red py-4">
                  Failed to load lenses
                </div>
                <v-list v-else>
                  <v-list-item
                    v-for="lens in lenses"
                    :key="lens.id"
                    class="mb-2"
                  >
                    <v-list-item-title>
                      {{ lens.manufacturerName }} {{ lens.modelName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ lens.mountType }} · f/{{ lens.maxAperture }} · Rp {{ lens.dayPrice }}/day
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-btn
                        size="small"
                        color="primary"
                        variant="tonal"
                        @click="selectLens(lens)"
                        :disabled="orderMutation.isPending.value"
                      >
                        Rent
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Order Form Dialog -->
            <v-dialog v-model="showOrderDialog" max-width="450">
              <v-card>
                <v-card-title>Rent {{ selectedLens?.modelName }}</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="orderForm.startDate"
                    label="Start Date"
                    type="date"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="orderForm.endDate"
                    label="End Date"
                    type="date"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn variant="text" @click="showOrderDialog = false">Cancel</v-btn>
                  <v-btn
                    color="primary"
                    :loading="orderMutation.isPending.value"
                    @click="placeOrder"
                  >
                    Place Order
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Order Success Snackbar -->
            <v-snackbar v-model="showSuccess" color="success" :timeout="3000">
              Order placed successfully!
            </v-snackbar>
            <v-snackbar v-model="showError" color="error" :timeout="3000">
              {{ errorMessage }}
            </v-snackbar>
          </v-col>

          <!-- Notifications -->
          <v-col cols="12" md="5">
            <HelloWorld />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useLenses } from "@/composables/useLenses";
import { useCreateOrder } from "@/composables/useOrders";
import HelloWorld from "@/components/HelloWorld.vue";
import AppFooter from "@/components/AppFooter.vue";

const { data: lenses, isLoading, error } = useLenses();
const orderMutation = useCreateOrder();

const showOrderDialog = ref(false);
const selectedLens = ref(null);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const orderForm = ref({
  startDate: "",
  endDate: "",
});

function selectLens(lens) {
  selectedLens.value = lens;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  orderForm.value.startDate = today.toISOString().split("T")[0];
  orderForm.value.endDate = tomorrow.toISOString().split("T")[0];
  showOrderDialog.value = true;
}

function placeOrder() {
  orderMutation.mutate(
    {
      customerName: "Daniel Ferdiansyah",
      customerEmail: "2306275052@gmail.com",
      lensId: selectedLens.value.id,
      startDate: orderForm.value.startDate,
      endDate: orderForm.value.endDate,
    },
    {
      onSuccess: () => {
        showOrderDialog.value = false;
        showSuccess.value = true;
      },
      onError: (err) => {
        errorMessage.value = err.message;
        showError.value = true;
      },
    }
  );
}
</script>
