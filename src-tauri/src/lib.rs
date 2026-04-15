// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::OnceLock;
use tauri::Manager;
static HOME_DIR: OnceLock<String> = OnceLock::new();
fn init_app_back(save_count: i32) -> Result<String, Box<dyn std::error::Error>> {
    let config_contents_option = get_file(path_join!(HOME_DIR.get().unwrap(), "data.json"));
    let config_content: String;
    if config_contents_option.is_none() {
        config_content = String::from("{}");
    } else {
        config_content = config_contents_option.unwrap();
    }
    let mut config_json = serde_json::from_str::<serde_json::Value>(config_content.as_str())?;
    let config_json = config_json
        .as_object_mut()
        .ok_or::<Box<dyn std::error::Error>>("Root cannot convert to Object".into())?;
    let gallery = config_json.get("gallery");
    if gallery.is_none() {
        config_json.insert(
            "gallery".to_string(),
            serde_json::Value::Object(serde_json::Map::new()),
        );
    }
    let save_instance = config_json.get("saveInstance");
    if save_instance.is_none() {
        config_json.insert(
            "saveInstance".to_string(),
            serde_json::Value::Object(serde_json::Map::new()),
        );
    }
    let global = config_json.get("global");
    if global.is_none() {
        config_json.insert(
            "global".to_string(),
            serde_json::Value::Object(serde_json::Map::new()),
        );
    }
    for i in 1..=save_count {
        let save_instance = config_json.get_mut("saveInstance").unwrap();
        let save_instance = save_instance
            .as_object_mut()
            .ok_or::<Box<dyn std::error::Error>>("SaveInstance cannot convert to Object".into())?;
        let saves = save_instance.get_mut(format!("save{}", i).as_str());
        if saves.is_none() {
            save_instance.insert(
                format!("save{}", i),
                serde_json::json!({
                    "current": 0,
                    "name": "",
                    "updateTime": "",
                    "chapter": 0
                }),
            );
        }
    }
    let return_json = serde_json::to_string_pretty(config_json).unwrap();
    set_file(
        path_join!(HOME_DIR.get().unwrap(), "data.json"),
        return_json.as_str(),
    )
    .ok_or::<Box<dyn std::error::Error>>("Cannot write file!".into())?;
    Ok(return_json.clone())
}
#[tauri::command]
fn save(
    id: i32,
    update_time: String,
    name: String,
    chapter: i32,
    current: i32,
    image: String,
    branches: serde_json::Value,
) {
    let config_content = get_file(path_join!(HOME_DIR.get().unwrap(), "data.json"))
        .expect("Cannot find config file!");
    let mut config_json = serde_json::from_str::<serde_json::Value>(config_content.as_str())
        .expect("Cannot convert config file to json!");
    let save_json = config_json
        .as_object_mut()
        .expect("Cannot convert config file root node to json object!")
        .get_mut("saveInstance")
        .expect("Cannot find saveInstance key!")
        .as_object_mut()
        .expect("Cannot convert config file saveInstance node to json object!")
        .get_mut(format!("save{}", id).as_str())
        .expect(format!("Cannot find save{} key!", id).as_str())
        .as_object_mut()
        .expect(format!("Cannot convert config file save{} node to json object!", id).as_str());

    save_json.insert(
        "current".to_string(),
        serde_json::Value::Number(current.into()),
    );
    save_json.insert("name".to_string(), serde_json::Value::String(name));
    save_json.insert(
        "chapter".to_string(),
        serde_json::Value::Number(chapter.into()),
    );
    save_json.insert(
        "updateTime".to_string(),
        serde_json::Value::String(update_time),
    );
    save_json.insert("image".to_string(), serde_json::Value::String(image));
    let branches_object = branches.as_object().unwrap();
    for (k, v) in branches_object.iter() {
        save_json.insert(format!("bch_{}", k), v.clone());
    }
    let return_json = serde_json::to_string_pretty(&config_json.clone()).unwrap();
    set_file(
        path_join!(HOME_DIR.get().unwrap(), "data.json"),
        return_json.as_str(),
    );
}
#[tauri::command]
fn update_gallery(id: String) {
    let config_content = get_file(path_join!(HOME_DIR.get().unwrap(), "data.json"))
        .expect("Cannot find config file!");
    let mut config_json = serde_json::from_str::<serde_json::Value>(config_content.as_str())
        .expect("Cannot convert config file to json!");
    let gallerys_json = config_json
        .as_object_mut()
        .expect("Cannot convert config file root node to json object!")
        .get_mut("gallery")
        .expect("Cannot find gallery key!")
        .as_object_mut()
        .expect("Cannot convert config file gallery node to json object!");
    gallerys_json.insert(id.clone(), serde_json::Value::Bool(true));
    let return_json = serde_json::to_string_pretty(&config_json.clone()).unwrap();
    set_file(
        path_join!(HOME_DIR.get().unwrap(), "data.json"),
        return_json.as_str(),
    );
}
#[tauri::command]
fn update_global(id: String, value: String) {
    let config_content = get_file(path_join!(HOME_DIR.get().unwrap(), "data.json"))
        .expect("Cannot find config file!");
    let mut config_json = serde_json::from_str::<serde_json::Value>(config_content.as_str())
        .expect("Cannot convert config file to json!");
    let global_json = config_json
        .as_object_mut()
        .expect("Cannot convert config file root node to json object!")
        .get_mut("global")
        .expect("Cannot find global key!")
        .as_object_mut()
        .expect("Cannot convert config file global node to json object!");
    global_json.insert(id.clone(), serde_json::Value::String(value));
    let return_json = serde_json::to_string_pretty(&config_json.clone()).unwrap();
    set_file(
        path_join!(HOME_DIR.get().unwrap(), "data.json"),
        return_json.as_str(),
    );
}
#[tauri::command]
fn init_app(save_count: i32) -> Result<String, String> {
    init_app_back(save_count).map_err(|e| e.to_string())
}
fn set_file(path: String, contents: &str) -> Option<()> {
    std::fs::write(path, contents.as_bytes()).ok()
}
fn get_file(path: String) -> Option<String> {
    std::fs::read_to_string(path).ok()
}
fn init_home_dir(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let base_dir = app_handle
        .path()
        .app_local_data_dir()
        .map_err(|_| "Cannot get data dir!".to_string())?;
    let home_dir = base_dir.join("my-tutorial-visual-novel");
    HOME_DIR
        .set(home_dir.to_string_lossy().to_string())
        .map_err(|_| "Cannot put all value!".to_string())?;
    create_dir(HOME_DIR.get().unwrap());
    Ok(())
}
pub fn create_dir(path: &str) -> bool {
    let p = std::path::Path::new(path);
    if !p.exists() || !p.is_dir() {
        if let Err(_) = std::fs::create_dir_all(p) {
            return false;
        }
    }
    return true;
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();
            init_home_dir(&app_handle)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            init_app,
            save,
            update_gallery,
            update_global
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[macro_export]
macro_rules! path_join {
    ($($part:expr),*) => {{
        let mut path_buf = std::path::PathBuf::new();
        $(path_buf.push($part);)*
        path_buf.to_string_lossy().to_string()
    }};
}
