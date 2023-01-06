import { defineComponent } from "vue";
import { EditProps } from "./props";
const Editor = defineComponent({
  name: "EditorVue",
  props: {
    ...EditProps
  },
  setup(props) {
    return () => {
      return (
        <div>
          <div>editor</div>
        </div>
      );
    };
  }
});
export default Editor;
