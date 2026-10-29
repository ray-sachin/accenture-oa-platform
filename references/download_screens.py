"""
Accenture OA Reference Screens Downloader & Deployer
Target Directory: c:\\Users\\rayne\\Downloads\\accenture-ide\\references\\screens\\
"""
import os
import shutil
import urllib.request

TARGET_DIR = r"c:\Users\rayne\Downloads\accenture-ide\references\screens"
os.makedirs(TARGET_DIR, exist_ok=True)

ASSETS = [
    # Category 1: Candidate System Check & Proctoring Instructions
    {
        "filename": "01_candidate_system_compatibility_check.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v927527c61372847f693ff5d4d3353f2d8"
    },
    {
        "filename": "02_screen_capture_permission_dialog.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v92590f84a60fd47ef83bd8c468fe0a12d"
    },
    {
        "filename": "03_registration_and_terms_agreement.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v93ae70820fc4d4aea9c4ad72744677769"
    },
    {
        "filename": "04_face_capture_proctoring_check.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v93542f98061e949308f52bfdbae2b2d19"
    },
    {
        "filename": "05_id_card_verification_capture.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9fd1ba3aa586947e6ba3343b7576d08c0"
    },
    {
        "filename": "06_proctored_session_consent_rules.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9559d5b3774c24cfe925d98c91077009a"
    },

    # Category 2: Cognitive & Technical Assessment MCQ Screen
    {
        "filename": "07_mcq_test_interface_layout.jpg",
        "url": "https://support.mettl.com/galleryDocuments/edbsn3dc637793d287067f07a211b0222bf379df05203a43438c75f7afcc18cac2089c6edbad266d36a0f7f76054e31669903?inline=true"
    },
    {
        "filename": "08_question_palette_states.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v927d93a7d6bee42efa6c7ea7fde9e0fd9"
    },
    {
        "filename": "09_section_tabs_and_time_remaining.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9adb2a185dbfc4f618db904dbc394bb13"
    },
    {
        "filename": "10_floating_calculator_tool.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v982c3d66088cc43de938bb0ceb9811ef5"
    },
    {
        "filename": "11_test_instructions_overlay.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9c9e4a5f4023644908e931be5e036b7cd"
    },

    # Category 3: Tri-Domain / DSA Coding Interface
    {
        "filename": "12_codelysis_backend_coding_ide.jpg",
        "url": "https://support.mettl.com/galleryDocuments/edbsn9ad27e4dfaaf1901187dc6c8857683fdcce3140c4a41000a384c8c8d746813920f4006755aacbb13b8f28dd53cb82412?inline=true"
    },
    {
        "filename": "13_accenture_tri_domain_portal_overview.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\366\media_0.png"
    },
    {
        "filename": "14_accenture_section1_dsa_screen.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\378\media_0.png"
    },
    {
        "filename": "15_accenture_section2_sql_database_screen.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\438\media_0.png"
    },
    {
        "filename": "16_accenture_section3_web_dev_screen.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\450\media_0.png"
    },
    {
        "filename": "17_frontend_coding_simulator_fes.jpg",
        "url": "https://support.mettl.com/galleryDocuments/edbsnbad785aa8bf8ac2b1755f80d29ad9ddf60ec110a98b25ffd3854f0ef317b62526e566d192776c6079a2399f62ff3b421?inline=true"
    },
    {
        "filename": "18_database_query_simulator_dblysis.jpg",
        "url": "https://support.mettl.com/galleryDocuments/edbsn35dc4a70f227c6df88fc7d0987bc8359c1682ae643007c53fe3146594ae0e18f29f24231b6708eef06544f23d503f098?inline=true"
    },

    # Category 4: Gamified Cognitive Assessment Screens
    {
        "filename": "19_gamified_direction_game_flow.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\258\media_0.png"
    },
    {
        "filename": "20_gamified_maths_quiz_crunch.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\210\media_0.png"
    },
    {
        "filename": "21_gamified_memory_maze_seek.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\222\media_0.png"
    },
    {
        "filename": "22_switch_challenge_deductive_logic.jpg",
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGNfQdU4Vun3PNulPsSCq0R-ztDjowrm2JbTdbZJfG2g&s=10"
    },

    # Category 5: Virtual Communication Assessment
    {
        "filename": "23_versant_part_a_reading_screen.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\273\media_0.png"
    },
    {
        "filename": "24_versant_part_b_repeat_screen.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\285\media_0.png"
    },
    {
        "filename": "25_versant_part_c_short_answer_questions.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\297\media_0.png"
    },
    {
        "filename": "26_versant_part_d_sentence_builds.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\309\media_0.png"
    },
    {
        "filename": "27_versant_part_e_story_retellings.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\321\media_0.png"
    },
    {
        "filename": "28_mettl_audio_recording_communication_screen.jpg",
        "url": "https://support.mettl.com/galleryDocuments/edbsn404398af91ea96ae2eb22502ce36a62e21d0140a7565cf3ed1165fcc9ea2b3f3f6cd5a79239473fedb1ce4bb7bb93682?inline=true"
    },

    # Category 6: Test Completion & Summary Dialogs
    {
        "filename": "29_assessment_section_status_summary_modal.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9ad3314073a284e6390186cdfcc15d4a6"
    },
    {
        "filename": "30_end_test_confirmation_popup.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9811a34846f0247669a5d96b92c1662c1"
    },
    {
        "filename": "31_section_timeout_alert_dialog.png",
        "local": r"C:\Users\rayne\.gemini\antigravity\brain\5fc3d342-08bb-481e-a8f4-ecd47b737d68\.system_generated\steps\414\media_0.png"
    },
    {
        "filename": "32_post_submission_feedback_screen.jpg",
        "url": "https://desk.zoho.com/DocsDisplay?zgId=692399203&mode=inline&blockId=g25v9ccd46b308ad04b9d8eef8c0acea2aab4"
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for item in ASSETS:
    dest_path = os.path.join(TARGET_DIR, item["filename"])
    if "local" in item and os.path.exists(item["local"]):
        try:
            shutil.copyfile(item["local"], dest_path)
            print(f"[COPIED] {item['filename']}")
            continue
        except Exception as e:
            print(f"[COPY FAILED] {item['filename']}: {e}")

    if "url" in item:
        try:
            req = urllib.request.Request(item["url"], headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, "wb") as f:
                f.write(resp.read())
            print(f"[DOWNLOADED] {item['filename']}")
        except Exception as e:
            print(f"[DOWNLOAD FAILED] {item['filename']}: {e}")

print(f"\nAll operations complete. Files available at: {TARGET_DIR}")
