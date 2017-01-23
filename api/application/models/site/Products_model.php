<?php

class Products_model extends CI_Model{
    public function get($id =false)
    {
        if($id==false){
            $q = $this->db->get('gry');
            $q=$q->result();
        }
        else{
            $this->db->where('id',$id);
            $q = $this->db->get('gry');
            $q=$q->row();
        }

        return $q;
    }


}