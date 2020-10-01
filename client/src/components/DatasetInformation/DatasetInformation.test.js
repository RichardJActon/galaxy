import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import DatasetInformation from "./DatasetInformation";
import datasetResponse from "./testData/datasetResponse";
import flushPromises from "flush-promises";
import createCache from "vuex-cache";
import moment from "moment";

const HDA_ID = "FOO_HDA_ID";

const localVue = createLocalVue();
localVue.use(Vuex);

const testStore = new Vuex.Store({
    plugins: [createCache()],
    modules: {
        datasetsStore: {
            state: HDA_ID,
            actions: {
                fetchDataset: jest.fn(),
            },
            getters: {
                dataset: () => datasetResponse,
            },
        },
    },
});

describe("DatasetInformation/DatasetInformation.vue", () => {
    let wrapper;
    let datasetInfoTable;

    beforeEach(async () => {
        const propsData = {
            hda_id: HDA_ID,
        };

        wrapper = mount(DatasetInformation, {
            store: testStore,
            propsData,
            localVue,
            computed: {
                dataset() {
                    return datasetResponse;
                },
            },
        });
        datasetInfoTable = wrapper.find("#dataset-details");
        await flushPromises();
    });

    it("dataset information should exist", async () => {
        // table should exist
        expect(datasetInfoTable).toBeTruthy();
        const rows = datasetInfoTable.findAll("tbody > tr");
        // should contain 6 rows
        expect(rows.length).toBe(6);
    });

    it("filesize should be formatted", async () => {
        const filesize = datasetInfoTable.find("#filesize > strong");
        expect(filesize.html()).toBe(`<strong>${datasetResponse.file_size}</strong>`);
    });

    it("Date should be formatted", async () => {
        const date = datasetInfoTable.find(".utc-time").text();
        const formated_date = moment.utc(datasetResponse.create_time).format("dddd MMM Do h:mm:ss YYYY [UTC]");
        expect(date).toBe(formated_date);
    });

    it("Table should render data accordingly", async () => {
        const rendered_entries = [
            { number: "hid" },
            { name: "name" },
            { dbkey: "metadata_dbkey" },
            { format: "file_ext" },
        ];
        rendered_entries.forEach((entry) => {
            console.log(entry);
        });
    });
});
